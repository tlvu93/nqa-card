import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
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
        title: true,
        description: true,
        promiseTo: true,
        expiryDate: true,
        isRecurring: true,
        recurringPeriod: true,
        vow: true,
        theme: true,
        isSecret: true,
        revealDate: true,
        createdAt: true,
      },
    });

    if (!promise) {
      return res.status(404).json({ message: 'Promise not found' });
    }

    // Check if the promise is secret and not yet revealed
    if (promise.isSecret && promise.revealDate) {
      const revealDate = new Date(promise.revealDate);
      if (revealDate > new Date()) {
        return res.status(403).json({
          message: `This promise is secret and will be revealed on ${revealDate.toLocaleDateString()}`,
        });
      }
    }

    return res.status(200).json(promise);
  } catch (error) {
    console.error('Failed to fetch promise:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
