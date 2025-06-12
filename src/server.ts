import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './services/blogRoutes';
import { TokenAnalysisService } from './services/tokenAnalysisService';
import mongoose from 'mongoose';
import connectDB from './config';


mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://suichaincheck.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use('/api/blogs', blogRoutes);


// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'ChainCheck API Server Running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// REAL TOKEN ANALYSIS ENDPOINT - USING YOUR API KEYS (FIXED VERSION)
app.get('/analyze/:contractAddress', async (req, res): Promise<void> => {
  try {
    let { contractAddress } = req.params;
    
    // Clean the contract address - fixes URL encoding issues
    contractAddress = decodeURIComponent(contractAddress).trim();
    
    console.log(`🔍 REAL ANALYSIS STARTED for: ${contractAddress}`);
    console.log(`🧹 Cleaned address: "${contractAddress}"`);
    console.log(`🔑 Using GoPlus API Key: ${process.env.GOPLUS_API_KEY?.substring(0, 8)}...`);
    console.log(`🔑 Using CoinGecko API Key: ${process.env.COINGECKO_API_KEY?.substring(0, 8)}...`);
    
    // Validate contract address
    if (!contractAddress || contractAddress.length < 5) {
      res.status(400).json({
        error: 'Invalid contract address',
        message: 'Contract address must be provided and valid',
        received: contractAddress
      });
      return;
    }

    // Create analysis service instance with your API keys
    const analysisService = new TokenAnalysisService();
    
    // Perform REAL analysis using your API keys
    console.log('📡 Calling real APIs...');
    const analysis = await analysisService.analyzeToken(contractAddress);

    console.log('✅ REAL ANALYSIS COMPLETED!');
    console.log('🏷️ Token:', `${analysis.tokenName} (${analysis.tokenSymbol})`);
    console.log('📊 Overall Score:', analysis.overallScore);
    console.log('🔒 Security Score:', analysis.contractBehavior.totalScore);
    console.log('💧 Liquidity Score:', analysis.liquidityHealth.totalScore);
    console.log('👥 Holder Score:', analysis.holderDistribution.totalScore);
    console.log('🌐 Community Score:', analysis.communitySignals.totalScore);
    
    res.json(analysis);
    return;

  } catch (error: any) {
    console.error('❌ REAL ANALYSIS FAILED:', error.message);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
    return;
  }
});

// Legacy liquidity endpoint (keeping for compatibility)
app.get('/liquidity/:contractAddress', (req, res) => {
  const { contractAddress } = req.params;
  
  console.log(`💧 Liquidity check for: ${contractAddress}`);
  
  res.json({
    contractAddress,
    price: '$1.25',
    volume24h: '$125,000',
    liquidity: '$450,000',
    priceChange24h: '+5.67%',
    marketCap: '$15,600,000',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 ChainCheck API Server Started!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 GoPlus API: ${process.env.GOPLUS_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔑 CoinGecko API: ${process.env.COINGECKO_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'https://suichaincheck.vercel.app'}`);
  console.log('==========================================');
});