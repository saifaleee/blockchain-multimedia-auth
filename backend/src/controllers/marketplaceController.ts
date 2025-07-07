import { Request, Response } from 'express';
import * as contractService from '../services/contractService';

export async function listToken(req: Request, res: Response) {
  try {
    const { tokenId, priceWei } = req.body as { tokenId: number; priceWei: string };
    if (!tokenId || !priceWei) return res.status(400).json({ error: 'tokenId and priceWei required' });
    const txHash = await contractService.listToken(tokenId, priceWei);
    return res.status(200).json({ txHash });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function purchaseToken(req: Request, res: Response) {
  try {
    const { tokenId, valueWei } = req.body as { tokenId: number; valueWei: string };
    if (!tokenId || !valueWei) return res.status(400).json({ error: 'tokenId and valueWei required' });
    const txHash = await contractService.purchaseToken(tokenId, valueWei);
    return res.status(200).json({ txHash });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
} 