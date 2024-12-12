import { NextApiRequest, NextApiResponse } from 'next';
import { hotnessRepo } from './utils/hotnessRepo';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    try {
      console.log('rr', req.body);
      const hotness = await hotnessRepo.oneUpHotness(req.body);
      console.log('hitting endpoint');
      res.status(201).json({ count: hotness });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching hotness' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default handler;
