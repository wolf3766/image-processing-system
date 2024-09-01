import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
  requestId: string;
  productName: string;
  inputImageUrls: string[];
  outputImageUrls?: string[];
  status: 'pending' | 'processing' | 'completed';
}

const ProductSchema: Schema = new Schema({
  requestId: { type: String, required: true },
  productName: { type: String, required: true },
  inputImageUrls: { type: [String], required: true },
  outputImageUrls: { type: [String] },
  status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
