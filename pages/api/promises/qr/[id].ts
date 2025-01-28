import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid promise ID' });
  }

  try {
    const promise = await prisma.promise.findUnique({
      where: { id },
      select: {
        id: true,
        creatorId: true,
        title: true,
        promiseTo: true,
        status: true,
      },
    });

    if (!promise) {
      return res.status(404).json({ message: 'Promise not found' });
    }

    if (promise.creatorId !== session.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this promise' });
    }

    // Generate QR code data URL
    const qrData = {
      id: promise.id,
      title: promise.title,
      promiseTo: promise.promiseTo,
      url: `${process.env.NEXTAUTH_URL}/promise/${promise.id}`,
    };

    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      type: 'image/png',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return res.status(200).json({ qrCode: qrCodeDataUrl });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
