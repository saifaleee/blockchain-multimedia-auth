import { Request, Response } from 'express';
import * as contractService from '../services/contractService';

// Get marketplace items
export async function getMarketplaceItems(req: Request, res: Response) {
  try {
    // Return empty array for now - in real implementation, query the marketplace contract for listed items
    res.json({ items: [] });
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
}

// Get marketplace activity
export async function getMarketplaceActivity(req: Request, res: Response) {
  try {
    // Return empty array for now - in real implementation, query blockchain events for marketplace activity
    res.json({ activities: [] });
  } catch (error) {
    console.error('Error fetching marketplace activity:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace activity' });
  }
}

// List token for sale
export async function listToken(req: Request, res: Response) {
  try {
    const { tokenId, priceWei } = req.body as { tokenId: number; priceWei: string };
    if (!tokenId || !priceWei) return res.status(400).json({ error: 'tokenId and priceWei required' });
    
    // In a real implementation, you would call the marketplace contract
    const txHash = await contractService.listToken(tokenId, priceWei);
    return res.status(200).json({ txHash });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

// Purchase token
export async function purchaseToken(req: Request, res: Response) {
  try {
    const { tokenId, valueWei } = req.body as { tokenId: number; valueWei: string };
    if (!tokenId || !valueWei) return res.status(400).json({ error: 'tokenId and valueWei required' });
    
    // In a real implementation, you would call the marketplace contract
    const txHash = await contractService.purchaseToken(tokenId, valueWei);
    return res.status(200).json({ txHash });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
} 