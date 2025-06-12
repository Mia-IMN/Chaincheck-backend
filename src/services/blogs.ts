import mongoose, { Document, Schema } from 'mongoose';
import { IBlog } from './index';

interface BlogDocument extends Omit<IBlog, 'id'>, Document {
  id: string;
}

const BlogSchema = new Schema<BlogDocument>({
  title: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  creator: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model<BlogDocument>('Blog', BlogSchema);
export default Blog;
