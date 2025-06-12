import { Router } from 'express';
import Blog from './blogs';

const router = Router();

let storedIds: string[] = []; // replace with MongoDB logic in your real app

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: 'Error saving blog' });
  }
});

export default router;
