import axios from 'axios';
import { TokenLiquidityInfo, DEXResponse } from '../types';

export const fetchTokenLiquidity = async (contractAddress: string): Promise<TokenLiquidityInfo> => {
  try {
    console.log(`💱 Fetching liquidity data for: ${contractAddress}`);

    // Try multiple DEX APIs in order of preference
    const dexAPIs = [
      () => fetchFromCetus(contractAddress),
      () => fetchFromTurbos(contractAddress),
      () => fetchFromBlueMove(contractAddress),
      () => fetchFromCoinGecko(contractAddress)
    ];

    for (const fetchMethod of dexAPIs) {
      try {
        const result = await fetchMethod();
        if (result) {
          console.log(`✅ Successfully fetched liquidity data from DEX`);
          return result;
        }
      } catch (error) {
        console.warn(`⚠️ Failed to fetch from one DEX, trying next...`);
        continue;
      }
    }

    // If all APIs fail, return default values
    console.warn(`⚠️ All DEX APIs failed for: ${contractAddress}`);
    return getDefaultLiquidityInfo();

  } catch (error) {
    console.error('❌ Error fetching token liquidity:', error);
    return getDefaultLiquidityInfo();
  }
};

const fetchFromCetus = async (contractAddress: string): Promise<TokenLiquidityInfo | null> => {
  try {
    // Cetus API endpoint (replace with actual endpoint when available)
    const url = `https://api-sui.cetus.zone/v1/market/token/${contractAddress}`;
    
    const response = await axios.get<DEXResponse>(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'ChainCheck/1.0'
      }
    });

    const data = response.data;
    
    return {
      price: data.price || 0,
      volume24h: data.volume24h || 0,
      liquidity: data.liquidity || 0,
      priceChange24h: data.priceChange24h || 0,
      marketCap: data.marketCap || 0
    };
  } catch (error) {
    console.warn('Cetus API failed:', error);
    return null;
  }
};

const fetchFromTurbos = async (contractAddress: string): Promise<TokenLiquidityInfo | null> => {
  try {
    // Turbos Finance API (replace with actual endpoint)
    const url = `https://api.turbos.finance/v1/pools/${contractAddress}`;
    
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'ChainCheck/1.0'
      }
    });

    // Parse Turbos response format
    const data = response.data;
    
    return {
      price: data.token_price || 0,
      volume24h: data.volume_24h || 0,
      liquidity: data.tvl || 0,
      priceChange24h: data.price_change_24h || 0
    };
  } catch (error) {
    console.warn('Turbos API failed:', error);
    return null;
  }
};

const fetchFromBlueMove = async (contractAddress: string): Promise<TokenLiquidityInfo | null> => {
  try {
    // BlueMove API (replace with actual endpoint)
    const url = `https://api.bluemove.net/api/v1/token/${contractAddress}`;
    
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'ChainCheck/1.0'
      }
    });

    const data = response.data;
    
    return {
      price: data.price || 0,
      volume24h: data.volume24h || 0,
      liquidity: data.liquidity || 0,
      priceChange24h: data.priceChange24h || 0
    };
  } catch (error) {
    console.warn('BlueMove API failed:', error);
    return null;
  }
};

const fetchFromCoinGecko = async (contractAddress: string): Promise<TokenLiquidityInfo | null> => {
  try {
    // CoinGecko API as fallback
    const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddress}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`;
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'ChainCheck/1.0'
      }
    });

    const tokenData = response.data[contractAddress.toLowerCase()];
    
    if (!tokenData) {
      return null;
    }
    
    return {
      price: tokenData.usd || 0,
      volume24h: tokenData.usd_24h_vol || 0,
      liquidity: 0, // CoinGecko doesn't provide liquidity data
      priceChange24h: tokenData.usd_24h_change || 0,
      marketCap: tokenData.usd_market_cap || 0
    };
  } catch (error) {
    console.warn('CoinGecko API failed:', error);
    return null;
  }
};

const getDefaultLiquidityInfo = (): TokenLiquidityInfo => {
  return {
    price: 'N/A',
    volume24h: 'N/A',
    liquidity: 'N/A',
    priceChange24h: 'N/A',
    marketCap: 'N/A'
  };
};