import mongoose, { Document, Schema } from 'mongoose';

interface IRequest extends Document {
  requestId: string;
  status: 'pending' | 'processing' | 'completed';
}

const RequestSchema: Schema = new Schema({
  requestId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
});

const Request = mongoose.model<IRequest>('Request', RequestSchema);
export default Request;
