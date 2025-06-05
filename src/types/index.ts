export interface TokenAnalysisRequest {
  contractAddress: string;
}

export interface ContractBehaviorScore {
  contractVerificationScore: number;
  honeypotScore: number;
  mintAuthorityScore: number;
  ownerPrivilegesScore: number;
  hiddenFunctionsScore: number;
  totalScore: number;
  details: {
    isVerified: boolean;
    isHoneypot: boolean;
    canMint: boolean;
    hasOwnerPrivileges: boolean;
    hasHiddenFunctions: boolean;
  };
}

export interface LiquidityHealthScore {
  poolLockedScore: number;
  liquidityDepthScore: number;
  deployerControlScore: number;
  poolAgeScore: number;
  totalScore: number;
  details: {
    isPoolLocked: boolean;
    liquidityUSD: number;
    deployerHasControl: boolean;
    poolAgeDays: number;
  };
}

export interface HolderDistributionScore {
  topHolderScore: number;
  whaleDetectionScore: number;
  deployerActivityScore: number;
  diversityScore: number;
  totalScore: number;
  details: {
    top5HoldersPercentage: number;
    largestHolderPercentage: number;
    totalHolders: number;
    deployerTxCount: number;
  };
}

export interface CommunitySignalsScore {
  socialPresenceScore: number;
  engagementScore: number;
  chainActivityScore: number;
  marketMentionScore: number;
  totalScore: number;
  details: {
    socialFollowers: number;
    engagementRate: number;
    txLast7Days: number;
    isListedOnCoinGecko: boolean;
  };
}

export interface TokenLiquidityInfo {
  price: string | number;
  volume24h: string | number;
  liquidity: string | number;
  priceChange24h?: string | number;
  marketCap?: string | number;
}

export interface CompleteTokenAnalysis {
  contractAddress: string;
  contractBehavior: ContractBehaviorScore;
  liquidityHealth: LiquidityHealthScore;
  holderDistribution: HolderDistributionScore;
  communitySignals: CommunitySignalsScore;
  liquidityInfo: TokenLiquidityInfo;
  overallScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface GoPlusResponse {
  code: number;
  message: string;
  result: {
    [contractAddress: string]: {
      is_verified: string;
      is_honeypot: string;
      can_take_back_ownership: string;
      cannot_buy: string;
      cannot_sell_all: string;
      slippage_modifiable: string;
      is_blacklisted: string;
      is_whitelisted: string;
      is_in_dex: string;
      buy_tax: string;
      sell_tax: string;
      lp_holders: Array<{
        address: string;
        tag: string;
        is_contract: number;
        balance: string;
        percent: string;
        is_locked: number;
      }>;
      holders: Array<{
        address: string;
        tag: string;
        is_contract: number;
        balance: string;
        percent: string;
      }>;
    };
  };
}

export interface SuiTokenMetadata {
  objectId: string;
  version: string;
  digest: string;
  type: string;
  content?: {
    dataType: string;
    type: string;
    hasPublicTransfer: boolean;
    fields?: any;
  };
}

export interface DEXResponse {
  price: number;
  volume24h: number;
  liquidity: number;
  priceChange24h?: number;
  marketCap?: number;
}