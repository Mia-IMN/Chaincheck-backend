import { Router, Request, Response } from 'express';
import Blog from './blogs';

const router = Router();

// ✅ IMPROVED: Get all blogs with better error handling
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('📚 Fetching all blogs...');
    
    const blogs = await Blog.find()
      .sort({ createdAt: -1 }) // Most recent first
      .lean(); // Returns plain JS objects for better performance
    
    console.log(`✅ Found ${blogs.length} blogs`);
    
    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error: any) {
    console.error('❌ Error fetching blogs:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching blogs',
      error: error.message 
    });
  }
});

// ✅ IMPROVED: Create new blog with validation
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('📝 Creating new blog...');
    console.log('📋 Blog data:', req.body);
    
    const { id, title, creator } = req.body;
    
    // ✅ IMPROVED: Validate required fields
    if (!id || !title || !creator) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['id', 'title', 'creator']
      });
    }
    
    // ✅ IMPROVED: Check if blog ID already exists
    const existingBlog = await Blog.findOne({ id });
    if (existingBlog) {
      return res.status(409).json({
        success: false,
        message: 'Blog with this ID already exists',
        conflictingId: id
      });
    }
    
    // Create new blog
    const newBlog = new Blog({
      id: id.trim(),
      title: title.trim(),
      creator: creator.trim()
    });
    
    const savedBlog = await newBlog.save();
    
    console.log('✅ Blog created successfully:', savedBlog.id);
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: savedBlog
    });
    
  } catch (error: any) {
    console.error('❌ Error creating blog:', error.message);
    
    // Handle specific MongoDB errors
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
    
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
});

// ✅ IMPROVED: Get blog by ID
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
    
    res.json({
      success: true,
      data: blog
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching blog:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
});

// ✅ IMPROVED: Delete blog by ID (optional)
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
    
    res.json({
      success: true,
      message: 'Blog deleted successfully',
      data: deletedBlog
    });
    
  } catch (error: any) {
    console.error('❌ Error deleting blog:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
});

export default router;