import axios from 'axios';
import { ContractBehaviorScore, GoPlusResponse } from '../types';

export const analyzeContractBehavior = async (contractAddress: string): Promise<ContractBehaviorScore> => {
  try {
    console.log(`🔍 Analyzing contract behavior for: ${contractAddress}`);

    // Fetch data from GoPlus Security API
    const goPlusUrl = `https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${contractAddress}`;
    const goPlusResponse = await axios.get<GoPlusResponse>(goPlusUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'ChainCheck/1.0'
      }
    });

    const tokenData = goPlusResponse.data.result?.[contractAddress];
    
    if (!tokenData) {
      console.warn(`⚠️ No data found for contract: ${contractAddress}`);
      // Return default scores if no data found
      return {
        contractVerificationScore: 0,
        honeypotScore: 0,
        mintAuthorityScore: 0,
        ownerPrivilegesScore: 0,
        hiddenFunctionsScore: 0,
        totalScore: 0,
        details: {
          isVerified: false,
          isHoneypot: true,
          canMint: true,
          hasOwnerPrivileges: true,
          hasHiddenFunctions: true
        }
      };
    }

    // Calculate individual scores (1 = good, 0 = bad)
    const contractVerificationScore = tokenData.is_verified === '1' ? 1 : 0;
    const honeypotScore = tokenData.is_honeypot === '0' ? 1 : 0;
    const mintAuthorityScore = tokenData.can_take_back_ownership === '0' ? 1 : 0;
    const ownerPrivilegesScore = (tokenData.cannot_buy === '0' && tokenData.cannot_sell_all === '0') ? 1 : 0;
    const hiddenFunctionsScore = tokenData.slippage_modifiable === '0' ? 1 : 0;

    // Calculate total score (average of all sub-scores)
    const totalScore = (
      contractVerificationScore +
      honeypotScore +
      mintAuthorityScore +
      ownerPrivilegesScore +
      hiddenFunctionsScore
    ) / 5;

    const result: ContractBehaviorScore = {
      contractVerificationScore,
      honeypotScore,
      mintAuthorityScore,
      ownerPrivilegesScore,
      hiddenFunctionsScore,
      totalScore: Math.round(totalScore * 100) / 100,
      details: {
        isVerified: tokenData.is_verified === '1',
        isHoneypot: tokenData.is_honeypot === '1',
        canMint: tokenData.can_take_back_ownership === '1',
        hasOwnerPrivileges: tokenData.cannot_buy === '1' || tokenData.cannot_sell_all === '1',
        hasHiddenFunctions: tokenData.slippage_modifiable === '1'
      }
    };

    console.log(`✅ Contract behavior analysis complete. Score: ${result.totalScore}`);
    return result;

  } catch (error) {
    console.error('❌ Error analyzing contract behavior:', error);
    
    // Return default low scores in case of error
    return {
      contractVerificationScore: 0,
      honeypotScore: 0,
      mintAuthorityScore: 0,
      ownerPrivilegesScore: 0,
      hiddenFunctionsScore: 0,
      totalScore: 0,
      details: {
        isVerified: false,
        isHoneypot: true,
        canMint: true,
        hasOwnerPrivileges: true,
        hasHiddenFunctions: true
      }
    };
  }
};