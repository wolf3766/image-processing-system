import sharp from 'sharp';
import axios from 'axios';
import Product from '../models/Product';
import RequestModel from '../models/Request';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';

export const processImages = async (products: any[], requestId: string) => {
  try {
    await RequestModel.updateOne({ requestId }, { status: 'processing' });

    for (const product of products) {
      const outputUrls: string[] = [];

      for (const url of product.inputImageUrls) {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const compressedImage = await sharp(response.data)
          .jpeg({ quality: 50 })
          .toBuffer();
        
        const filename = `${uuidv4()}.jpg`;

        const outputUrl = await uploadToCloudStorage(compressedImage, filename);

        outputUrls.push(outputUrl);
      }

      await Product.updateOne({ _id: product._id }, { outputImageUrls: outputUrls, status: 'completed' });
    }

    await RequestModel.updateOne({ requestId }, { status: 'completed' });
    triggerWebhook(requestId);
  } catch (error) {
    console.error('Error processing images:', error);
  }
};

const triggerWebhook = async (requestId: string) => {
  try {
    await axios.post('https://webhook-url', { requestId, status: 'completed' });
  } catch (error) {
    console.error('Error triggering webhook:', error);
  }
};

const uploadToCloudStorage = async (image: Buffer, filename: string) => {
  const s3 = new S3();
  const params = {
    Bucket: 'bucket-name',
    Key: filename,
    Body: image,
    ACL: 'public-read',
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}
