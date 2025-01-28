import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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
        creatorId: true,
        status: true,
      },
    });

    if (!promise) {
      return res.status(404).json({ message: 'Promise not found' });
    }

    if (promise.creatorId !== session.user.id) {
      return res.status(403).json({ message: 'Not authorized to forfeit this promise' });
    }

    if (promise.status === 'CANCELLED' || promise.status === 'FULFILLED') {
      return res.status(400).json({ message: 'Cannot forfeit a completed promise' });
    }

    const updatedPromise = await prisma.promise.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    return res.status(200).json(updatedPromise);
  } catch (error) {
    console.error('Failed to forfeit promise:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
