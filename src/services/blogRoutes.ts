import { Router, Request, Response } from 'express';
import Blog from './blogs';

const router = Router();

// ✅ Get all blogs
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('📚 Fetching all blogs...');

    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    console.log(`✅ Found ${blogs.length} blogs`);

    return res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error: any) {
    console.error('❌ Error fetching blogs:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
});

// ✅ Create new blog
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('📝 Creating new blog...');
    console.log('📋 Blog data:', req.body);

    const { id, title, creator } = req.body;

    if (!id || !title || !creator) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['id', 'title', 'creator']
      });
    }

    const existingBlog = await Blog.findOne({ id });
    if (existingBlog) {
      return res.status(409).json({
        success: false,
        message: 'Blog with this ID already exists',
        conflictingId: id
      });
    }

    const newBlog = new Blog({
      id: id.trim(),
      title: title.trim(),
      creator: creator.trim()
    });

    const savedBlog = await newBlog.save();
    console.log('✅ Blog created successfully:', savedBlog.id);

    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: savedBlog
    });
  } catch (error: any) {
    console.error('❌ Error creating blog:', error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Blog with this ID already exists',
        error: 'Duplicate key error'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
});

// ✅ Get blog by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching blog with ID: ${id}`);

    const blog = await Blog.findOne({ id }).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
        id: id
      });
    }

    console.log('✅ Blog found:', blog.title);

    return res.json({
      success: true,
      data: blog
    });
  } catch (error: any) {
    console.error('❌ Error fetching blog:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
});

// ✅ Delete blog by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting blog with ID: ${id}`);

    const deletedBlog = await Blog.findOneAndDelete({ id });

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
        id: id
      });
    }

    console.log('✅ Blog deleted:', deletedBlog.title);

    return res.json({
      success: true,
      message: 'Blog deleted successfully',
      data: deletedBlog
    });
  } catch (error: any) {
    console.error('❌ Error deleting blog:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
});

export default router;
