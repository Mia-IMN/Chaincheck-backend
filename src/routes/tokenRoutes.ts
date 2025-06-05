import { Router } from 'express';
import {
  analyzeToken,
  getContractBehavior,
  getLiquidityHealth,
  getHolderDistribution,
  getCommunitySignals,
  getTokenLiquidity
} from '../controllers/tokenController';

const router = Router();

// Complete token analysis (all metrics combined)
router.post('/analyze-token', analyzeToken);

// Individual metric endpoints
router.get('/contract-behavior/:contractAddress', getContractBehavior);
router.get('/liquidity-health/:contractAddress', getLiquidityHealth);
router.get('/holder-distribution/:contractAddress', getHolderDistribution);
router.get('/community-signals/:contractAddress', getCommunitySignals);
router.get('/token-liquidity/:contractAddress', getTokenLiquidity);

export default router;