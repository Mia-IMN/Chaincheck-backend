import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Default error response
  const response: ApiResponse = {
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  };

  // Handle different types of errors
  if (error.name === 'ValidationError') {
    response.error = 'Invalid input data';
    res.status(400).json(response);
    return;
  }

  if (error.name === 'UnauthorizedError') {
    response.error = 'Unauthorized access';
    res.status(401).json(response);
    return;
  }

  if (error.message.includes('timeout')) {
    response.error = 'Request timeout - external API took too long';
    res.status(408).json(response);
    return;
  }

  if (error.message.includes('rate limit')) {
    response.error = 'Rate limit exceeded';
    res.status(429).json(response);
    return;
  }

  // Default 500 error
  res.status(500).json(response);
};