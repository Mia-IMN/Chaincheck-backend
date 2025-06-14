import mongoose, { Document, Schema } from 'mongoose';
import { IBlog } from './index';

// ✅ IMPROVED: Extend Document properly
interface BlogDocument extends Omit<IBlog, 'id'>, Document {}

// ✅ IMPROVED: Better schema with validation
const BlogSchema = new Schema<BlogDocument>({
  id: { 
    type: String, 
    required: [true, 'Blog ID is required'],
    unique: true,
    trim: true
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  creator: { 
    type: String, 
    required: [true, 'Creator name is required'],
    trim: true,
    maxlength: [100, 'Creator name cannot exceed 100 characters']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  // ✅ IMPROVED: Add schema options
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false // Remove __v field
});

// ✅ IMPROVED: Add indexes for better performance
BlogSchema.index({ createdAt: -1 }); // For sorting by creation time
BlogSchema.index({ creator: 1 }); // For filtering by creator
// BlogSchema.index({ id: 1 }); // For finding by blog ID

// ✅ IMPROVED: Add custom methods if needed
BlogSchema.methods.toJSON = function() {
  const blogObject = this.toObject();
  // You can customize what gets returned here
  return blogObject;
};

const Blog = mongoose.model<BlogDocument>('Blog', BlogSchema);

export default Blog;