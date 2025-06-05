import axios from 'axios';
import { HolderDistributionScore, GoPlusResponse } from '../types';

export const analyzeHolderDistribution = async (contractAddress: string): Promise<HolderDistributionScore> => {
  try {
    console.log(`👥 Analyzing holder distribution for: ${contractAddress}`);

    // Fetch holder data from GoPlus API
    const goPlusUrl = `https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${contractAddress}`;
    const goPlusResponse = await axios.get<GoPlusResponse>(goPlusUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'ChainCheck/1.0'
      }
    });

    const tokenData = goPlusResponse.data.result?.[contractAddress];

    if (!tokenData || !tokenData.holders) {
      console.warn(`⚠️ No holder data found for: ${contractAddress}`);
      return getDefaultHolderScore();
    }

    const holders = tokenData.holders;
    const totalHolders = holders.length;

    // Calculate individual scores
    const topHolderScore = calculateTopHolderScore(holders);
    const whaleDetectionScore = calculateWhaleDetectionScore(holders);
    const deployerActivityScore = calculateDeployerActivityScore(holders);
    const diversityScore = calculateDiversityScore(totalHolders);

    const totalScore = (
      topHolderScore +
      whaleDetectionScore +
      deployerActivityScore +
      diversityScore
    ) / 4;

    // Calculate additional details
    const top5HoldersPercentage = holders
      .slice(0, 5)
      .reduce((sum, holder) => sum + parseFloat(holder.percent || '0'), 0);

    const largestHolderPercentage = Math.max(
      ...holders.map(holder => parseFloat(holder.percent || '0'))
    );

    const deployerTxCount = holders
      .filter(holder => holder.tag === 'deployer')
      .length;

    const result: HolderDistributionScore = {
      topHolderScore,
      whaleDetectionScore,
      deployerActivityScore,
      diversityScore,
      totalScore: Math.round(totalScore * 100) / 100,
      details: {
        top5HoldersPercentage: Math.round(top5HoldersPercentage * 100) / 100,
        largestHolderPercentage: Math.round(largestHolderPercentage * 100) / 100,
        totalHolders,
        deployerTxCount
      }
    };

    console.log(`✅ Holder distribution analysis complete. Score: ${result.totalScore}`);
    return result;

  } catch (error) {
    console.error('❌ Error analyzing holder distribution:', error);
    return getDefaultHolderScore();
  }
};

const calculateTopHolderScore = (holders: any[]): number => {
  // Calculate if top 5 holders own less than 50%
  const top5Percentage = holders
    .slice(0, 5)
    .reduce((sum, holder) => sum + parseFloat(holder.percent || '0'), 0);
  
  return top5Percentage < 50 ? 1 : 0;
};

const calculateWhaleDetectionScore = (holders: any[]): number => {
  // Check if any single holder owns more than 20%
  const hasWhale = holders.some(holder => parseFloat(holder.percent || '0') > 20);
  return hasWhale ? 0 : 1;
};

const calculateDeployerActivityScore = (holders: any[]): number => {
  // Check deployer activity (fewer deployer entries = better)
  const deployerCount = holders.filter(holder => holder.tag === 'deployer').length;
  return deployerCount < 5 ? 1 : 0;
};

const calculateDiversityScore = (totalHolders: number): number => {
  // Score based on number of holders (more = better)
  if (totalHolders >= 1000) return 1;
  if (totalHolders >= 500) return 0.8;
  if (totalHolders >= 200) return 0.6;
  if (totalHolders >= 100) return 0.4;
  if (totalHolders >= 50) return 0.2;
  return 0;
};

const getDefaultHolderScore = (): HolderDistributionScore => {
  return {
    topHolderScore: 0,
    whaleDetectionScore: 0,
    deployerActivityScore: 0,
    diversityScore: 0,
    totalScore: 0,
    details: {
      top5HoldersPercentage: 100,
      largestHolderPercentage: 100,
      totalHolders: 0,
      deployerTxCount: 0
    }
  };
};