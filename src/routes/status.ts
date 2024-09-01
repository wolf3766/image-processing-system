import { Router, Request, Response } from 'express';
import RequestModel from '../models/Request';

const router = Router();

router.get('/:requestId', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const request = await RequestModel.findOne({ requestId });
    if (!request) return res.status(404).json({ message: 'Request ID not found' });

    res.status(200).json({ requestId: request.requestId, status: request.status });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching status', error });
  }
});

export default router;
