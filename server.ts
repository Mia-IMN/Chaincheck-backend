import dotenv from 'dotenv';
import express, { Express } from 'express';
import connectDB from './src/config';

dotenv.config();

const app: Express = express();

// Connect to MongoDB
connectDB();

// ...rest of your server code