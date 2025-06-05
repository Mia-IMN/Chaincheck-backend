import { Request, Response } from 'express';
import {
  analyzeContractBehavior,
  analyzeLiquidityHealth,
  analyzeHolderDistribution,
  analyzeCommunitySignals,
  fetchTokenLiquidity
} from '../services';
import { ApiResponse, CompleteTokenAnalysis } from '../types';

// Complete token analysis with all metrics
export const analyzeToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contractAddress } = req.body;

    if (!contractAddress) {
      res.status(400).json({
        success: false,
        error: 'Contract address is required',
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    console.log(`🔍 Analyzing token: ${contractAddress}`);

    // Fetch all analysis data in parallel
    const [
      contractBehavior,
      liquidityHealth,
      holderDistribution,
      communitySignals,
      liquidityInfo
    ] = await Promise.all([
      analyzeContractBehavior(contractAddress),
      analyzeLiquidityHealth(contractAddress),
      analyzeHolderDistribution(contractAddress),
      analyzeCommunitySignals(contractAddress),
      fetchTokenLiquidity(contractAddress)
    ]);

    // Calculate overall score (weighted average)
    const overallScore = (
      contractBehavior.totalScore * 0.3 +
      liquidityHealth.totalScore * 0.25 +
      holderDistribution.totalScore * 0.25 +
      communitySignals.totalScore * 0.2
    );

    // Determine risk level based on overall score
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
    if (overallScore >= 0.8) riskLevel = 'LOW';
    else if (overallScore >= 0.6) riskLevel = 'MEDIUM';
    else if (overallScore >= 0.4) riskLevel = 'HIGH';
    else riskLevel = 'VERY_HIGH';

    const result: CompleteTokenAnalysis = {
      contractAddress,
      contractBehavior,
      liquidityHealth,
      holderDistribution,
      communitySignals,
      liquidityInfo,
      overallScore: Math.round(overallScore * 100) / 100,
      riskLevel,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    } as ApiResponse<CompleteTokenAnalysis>);

  } catch (error) {
    console.error('Error in analyzeToken:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze token',
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }
};

// Individual metric endpoints
export const getContractBehavior = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contractAddress } = req.params;
    const result = await analyzeContractBehavior(contractAddress);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getContractBehavior:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze contract behavior',
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }
};

export const getLiquidityHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contractAddress } = req.params;
    const result = await analyzeLiquidityHealth(contractAddress);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getLiquidityHealth:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze liquidity health',
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }
};

export const getHolderDistribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contractAddress } = req.params;
    const result = await analyzeHolderDistribution(contractAddress);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getHolderDistribution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze holder distribution',
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }
};

export const getCommunitySignals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contractAddress } = req.params;
    const result = await analyzeCommunitySignals(contractAddress);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getCommunitySignals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze community signals',
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }
};

export const getTokenLiquidity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contractAddress } = req.params;
    const result = await fetchTokenLiquidity(contractAddress);
    
    res.json({
      success: true,
      data: { contractAddress, liquidityInfo: result },
      timestamp: new Date().toISOString()
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getTokenLiquidity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch token liquidity',
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }
};