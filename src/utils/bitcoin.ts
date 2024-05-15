import { logger } from './logger';

// TODO: generally, better error handling is needed

export interface BlockCountResponse {
  id: string | null;
  error: string | null;
  result: number;
  jsonrpc: string;
}

export interface EstimateSmartFeeResponse {
  id: string | null;
  error: string | null;
  result: {
    feerate: number;
    blocks: number;
  };
  jsonrpc: string;
}

/**
 * Get the current block height
 * @returns the current block height
 */
export const getBlockCount = async (): Promise<number> => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    method: 'getblockcount',
  });

  const requestOptions = {
    method: 'POST',
    headers,
    body,
    redirect: 'follow' as RequestRedirect,
  };

  try {
    const response = await fetch(process.env.BITCOIN_RPC_URL!, requestOptions);
    const data: BlockCountResponse = await response.json();
    return data.result;
  } catch (error) {
    logger.error(`Error getting block count: ${error}`);
    throw error;
  }
};

/**
 * Get the esimtated fee for a transaction
 * @param confTarget - the confirmation target
 * @returns the estimated fee
 */
export const estimateSmartFee = async (confTarget: number): Promise<number> => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    method: 'estimatesmartfee',
    params: [confTarget],
  });
  const requestOptions = {
    method: 'POST',
    headers,
    body,
    redirect: 'follow' as RequestRedirect,
  };
  try {
    const response = await fetch(process.env.BITCOIN_RPC_URL!, requestOptions);
    const data: EstimateSmartFeeResponse = await response.json();
    return data.result.feerate;
  } catch (error) {
    logger.error(`Error getting estimated smart fee: ${error}`);
    throw error;
  }
};
