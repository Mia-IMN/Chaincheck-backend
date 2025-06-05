import axios from 'axios';
import { LiquidityHealthScore, GoPlusResponse } from '../types';

export const analyzeLiquidityHealth = async (contractAddress: string): Promise<LiquidityHealthScore> => {
  try {
    console.log(`💧 Analyzing liquidity health for: ${contractAddress}`);

    // Fetch liquidity data from GoPlus API
    const goPlusUrl = `https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${contractAddress}`;
    const goPlusResponse = await axios.get<GoPlusResponse>(goPlusUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'ChainCheck/1.0'
      }
    });

    const tokenData = goPlusResponse.data.result?.[contractAddress];

    if (!tokenData) {
      console.warn(`⚠️ No liquidity data found for: ${contractAddress}`);
      return getDefaultLiquidityScore();
    }

    // Analyze LP holders for liquidity metrics
    const lpHolders = tokenData.lp_holders || [];
    const totalLPValue = lpHolders.reduce((sum, holder) => {
      return sum + parseFloat(holder.balance || '0');
    }, 0);

    // Calculate individual scores
    const poolLockedScore = calculatePoolLockScore(lpHolders);
    const liquidityDepthScore = calculateLiquidityDepthScore(totalLPValue);
    const deployerControlScore = calculateDeployerControlScore(lpHolders);
    const poolAgeScore = calculatePoolAgeScore(); // This would need additional API calls

    const totalScore = (
      poolLockedScore +
      liquidityDepthScore +
      deployerControlScore +
      poolAgeScore
    ) / 4;

    const result: LiquidityHealthScore = {
      poolLockedScore,
      liquidityDepthScore,
      deployerControlScore,
      poolAgeScore,
      totalScore: Math.round(totalScore * 100) / 100,
      details: {
        isPoolLocked: poolLockedScore === 1,
        liquidityUSD: totalLPValue,
        deployerHasControl: deployerControlScore === 0,
        poolAgeDays: 0 // Would need additional data
      }
    };

    console.log(`✅ Liquidity health analysis complete. Score: ${result.totalScore}`);
    return result;

  } catch (error) {
    console.error('❌ Error analyzing liquidity health:', error);
    return getDefaultLiquidityScore();
  }
};

const calculatePoolLockScore = (lpHolders: any[]): number => {
  // Check if any LP tokens are locked
  const hasLockedLP = lpHolders.some(holder => holder.is_locked === 1);
  return hasLockedLP ? 1 : 0;
};

const calculateLiquidityDepthScore = (totalLPValue: number): number => {
  // Score based on liquidity depth (>$10k considered good)
  return totalLPValue > 10000 ? 1 : 0;
};

const calculateDeployerControlScore = (lpHolders: any[]): number => {
  // Check if deployer still controls significant LP tokens
  const deployerLPPercentage = lpHolders
    .filter(holder => holder.tag === 'deployer')
    .reduce((sum, holder) => sum + parseFloat(holder.percent || '0'), 0);
  
  // Score is higher if deployer has less control
  return deployerLPPercentage < 50 ? 1 : 0;
};

const calculatePoolAgeScore = (): number => {
  // This would require additional API calls to get pool creation time
  // For now, returning neutral score
  return 0.5;
};

const getDefaultLiquidityScore = (): LiquidityHealthScore => {
  return {
    poolLockedScore: 0,
    liquidityDepthScore: 0,
    deployerControlScore: 0,
    poolAgeScore: 0,
    totalScore: 0,
    details: {
      isPoolLocked: false,
      liquidityUSD: 0,
      deployerHasControl: true,
      poolAgeDays: 0
    }
  };
};