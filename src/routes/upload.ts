import { Router, Request, Response } from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import {v4 as uuidv4 } from 'uuid';
import Product from '../models/Product';
import RequestModel from '../models/Request';
import { processImages } from '../services/imageService';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const requestId = uuidv4();
    const products: any[] = [];

    const request = new RequestModel({ requestId, status: 'pending' });
    await request.save();

    req.file?.path && require('fs').createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data: any) => {
        const product = new Product({
          requestId,
          productName: data['Product Name'],
          inputImageUrls: data['Input Image Urls'].split(',').map((url: string) => url.trim()),
          status: 'pending',
        });
        products.push(product);
      })
      .on('end', async () => {
        await Product.insertMany(products);
        processImages(products, requestId);
        res.status(200).json({ requestId });
      });
  } catch (error) {
    res.status(500).json({ message: 'Error processing the file', error });
  }
});

export default router;
