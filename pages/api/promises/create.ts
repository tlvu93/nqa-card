import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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

    const { title, description, promiseTo } = req.body;

    if (!title || !description || !promiseTo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const promise = await prisma.promise.create({
      data: {
        title,
        description,
        promiseTo,
        creatorId: user.id,
      },
    });

    return res.status(201).json(promise);
  } catch (error) {
    console.error('Promise creation error:', error);
    return res.status(500).json({ message: 'Error creating promise' });
  }
}
