import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import multer from 'multer';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Promise to handle multer upload
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Handle file uploads
    await runMiddleware(
      req,
      res,
      upload.fields([
        { name: 'proofImage', maxCount: 1 },
        { name: 'voiceRecording', maxCount: 1 },
      ])
    );

    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Parse the form data
    const formData = JSON.parse((req as any).body.data);
    const { files } = req as any;

    const {
      title,
      description,
      promiseTo,
      expiryDate,
      isRecurring,
      recurringPeriod,
      vow,
      vowTemplate,
      proofComment,
      recipientEmail,
      theme,
      isSecret,
      revealDate,
    } = formData;

    if (!title || !description || !promiseTo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create the promise with validated data
    const promiseData = {
      title,
      description,
      promiseTo,
      creatorId: user.id,
      status: 'ACTIVE',
      ...(expiryDate && { expiryDate: new Date(expiryDate) }),
      ...(isRecurring !== undefined && { isRecurring }),
      ...(recurringPeriod && { recurringPeriod }),
      ...(vow && { vow }),
      ...(vowTemplate && { vowTemplate }),
      ...(proofComment && { proofComment }),
      ...(recipientEmail && { recipientEmail }),
      ...(theme && { theme }),
      ...(isSecret !== undefined && { isSecret }),
      ...(revealDate && { revealDate: new Date(revealDate) }),
      ...(files?.proofImage?.[0] && { proofImage: files.proofImage[0].filename }),
      ...(files?.voiceRecording?.[0] && { voiceRecording: files.voiceRecording[0].filename }),
    };

    const promise = await prisma.promise.create({
      data: promiseData,
    });

    // If it's a recurring promise, create initial reminders
    if (isRecurring && expiryDate) {
      const reminderDate = new Date(expiryDate);
      reminderDate.setDate(reminderDate.getDate() - 1); // Set reminder 1 day before

      await prisma.reminder.create({
        data: {
          date: reminderDate,
          promiseId: promise.id,
          sent: false,
        },
      });
    }

    return res.status(201).json(promise);
  } catch (error) {
    console.error('Promise creation error:', error);
    return res.status(500).json({ message: 'Error creating promise' });
  }
}
