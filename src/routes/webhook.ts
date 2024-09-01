import { Router, Request, Response } from 'express';

const router = Router();

router.post('/webhook', (req: Request, res: Response) => {
  console.log('Webhook received:', req.body);
  res.status(200).send('Webhook processed');
});

export default router;
