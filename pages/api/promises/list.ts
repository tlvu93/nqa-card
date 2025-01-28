import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const promises = await prisma.promise.findMany({
      where: {
        creatorId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reactions: true,
        challenges: true,
      },
    });

    return res.status(200).json(promises);
  } catch (error) {
    console.error('Error fetching promises:', error);
    return res.status(500).json({ message: 'Error fetching promises' });
  }
}
