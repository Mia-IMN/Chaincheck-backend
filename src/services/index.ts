export { analyzeContractBehavior } from './contractBehaviorService';
export { analyzeLiquidityHealth } from './liquidityHealthService';
export { analyzeHolderDistribution } from './holderDistributionService';
export { analyzeCommunitySignals } from './communitySignalsService';
export { fetchTokenLiquidity } from './dexService';

// Blog interface definition
export interface IBlog {
  id: string;           // blogID from Walrus
  title: string;        // title of the blog
  creator: string;      // name of the blog creator
  createdAt: Date;      // time it was posted
}