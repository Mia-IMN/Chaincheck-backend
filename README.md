# ChainCheck Backend API

A comprehensive TypeScript backend service for analyzing token security, liquidity health, holder distribution, and community signals on blockchain networks.

## 🚀 Features

- **Smart Contract Behavior Analysis**: Detect honeypots, mint authority, owner privileges
- **Liquidity Health Assessment**: Analyze pool locks, liquidity depth, deployer control
- **Holder Distribution Analysis**: Check whale concentration, deployer activity, holder diversity
- **Community Signals Evaluation**: Social media presence, engagement, market mentions
- **Token Liquidity Data**: Real-time price, volume, and liquidity information from multiple DEXs
- **Complete Token Scoring**: Weighted scoring system with risk level assessment

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd chaincheck-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend Configuration (Update with your frontend URL)
FRONTEND_URL=http://localhost:3000

# API Keys (Optional but recommended for better data)
GOPLUS_API_KEY=your_goplus_api_key_here
COINGECKO_API_KEY=your_coingecko_api_key_here

# Sui Network Configuration
SUI_RPC_URL=https://fullnode.mainnet.sui.io
SUI_TESTNET_RPC_URL=https://fullnode.testnet.sui.io
```

### 4. Build the Project

```bash
npm run build
```

### 5. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or your specified PORT).

## 🏗️ Project Structure

```
chaincheck-backend/
├── src/
│   ├── controllers/
│   │   └── tokenController.ts      # Request handlers
│   ├── services/
│   │   ├── contractBehaviorService.ts
│   │   ├── liquidityHealthService.ts
│   │   ├── holderDistributionService.ts
│   │   ├── communitySignalsService.ts
│   │   ├── dexService.ts
│   │   └── index.ts
│   ├── routes/
│   │   └── tokenRoutes.ts          # API route definitions
│   ├── middleware/
│   │   ├── errorHandler.ts         # Global error handling
│   │   └── rateLimiter.ts          # Rate limiting
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   └── server.ts                   # Main server file
├── dist/                           # Compiled JavaScript (auto-generated)
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 📡 API Endpoints

### Complete Analysis
- **POST** `/api/analyze-token`
  ```json
  {
    "contractAddress": "0x123..."
  }
  ```

### Individual Metrics
- **GET** `/api/contract-behavior/:contractAddress`
- **GET** `/api/liquidity-health/:contractAddress`
- **GET** `/api/holder-distribution/:contractAddress`
- **GET** `/api/community-signals/:contractAddress`
- **GET** `/api/token-liquidity/:contractAddress`

### Health Check
- **GET** `/health` - Server health status

## 🖥️ Frontend Integration

### Setup API Client

Create an API service in your frontend project:

```typescript
// frontend/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Complete token analysis
export const analyzeToken = async (contractAddress: string) => {
  try {
    const response = await api.post('/analyze-token', { contractAddress });
    return response.data;
  } catch (error) {
    throw new Error('Failed to analyze token');
  }
};

// Individual metric functions
export const getContractBehavior = async (contractAddress: string) => {
  const response = await api.get(`/contract-behavior/${contractAddress}`);
  return response.data;
};

export const getLiquidityHealth = async (contractAddress: string) => {
  const response = await api.get(`/liquidity-health/${contractAddress}`);
  return response.data;
};

export const getHolderDistribution = async (contractAddress: string) => {
  const response = await api.get(`/holder-distribution/${contractAddress}`);
  return response.data;
};

export const getCommunitySignals = async (contractAddress: string) => {
  const response = await api.get(`/community-signals/${contractAddress}`);
  return response.data;
};

export const getTokenLiquidity = async (contractAddress: string) => {
  const response = await api.get(`/token-liquidity/${contractAddress}`);
  return response.data;
};
```

### Frontend Component Example

```typescript
// frontend/src/components/TokenAnalysis.tsx
import React, { useState } from 'react';
import { analyzeToken } from '../services/api';

const TokenAnalysis: React.FC = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!contractAddress) return;
    
    setLoading(true);
    try {
      const result = await analyzeToken(contractAddress);
      setAnalysis(result.data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Token Analysis</h1>
      
      <div className="mb-4">
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter contract address..."
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Analyzing...' : 'Analyze Token'}
        </button>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Overall Score</h3>
            <p className="text-2xl">{analysis.overallScore}</p>
            <p className={`text-sm ${analysis.riskLevel === 'LOW' ? 'text-green-500' : 'text-red-500'}`}>
              Risk: {analysis.riskLevel}
            </p>
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Contract Behavior</h3>
            <p>Score: {analysis.contractBehavior.totalScore}</p>
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Liquidity Health</h3>
            <p>Score: {analysis.liquidityHealth.totalScore}</p>
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Holder Distribution</h3>
            <p>Score: {analysis.holderDistribution.totalScore}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenAnalysis;
```

## 🚦 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Update your production `.env`:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Options

1. **Heroku**
2. **Railway**
3. **Render**
4. **DigitalOcean App Platform**
5. **AWS/Google Cloud/Azure**

## 🔧 Development Scripts

```bash
# Development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run tests
npm test
```

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15-minute window
- **CORS Protection**: Configurable for your frontend domain
- **Helmet Security**: Basic security headers
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Comprehensive error responses

## 📊 API Response Format

All API responses follow this structure:

```typescript
{
  "success": boolean,
  "data": any,          // Present on success
  "error": string,      // Present on error
  "timestamp": string
}
```

## 🔍 API Keys and External Services

### Required Services:
- **GoPlus Security API**: For security analysis
- **CoinGecko API**: For market data (optional)
- **DEX APIs**: For liquidity data

### Getting API Keys:
1. **GoPlus**: Visit [GoPlus Labs](https://gopluslabs.io/) for API access
2. **CoinGecko**: Register at [CoinGecko](https://coingecko.com/en/api) for Pro API

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update `FRONTEND_URL` in `.env`
2. **Port Already in Use**: Change `PORT` in `.env`
3. **API Timeouts**: Check network connectivity and API key validity
4. **TypeScript Errors**: Run `npm run build` to check compilation

### Debug Mode:

Set `LOG_LEVEL=debug` in `.env` for detailed logging.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the SUI License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository

---

**Happy Coding! 🚀**