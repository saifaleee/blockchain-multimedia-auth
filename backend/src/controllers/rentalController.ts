import { Request, Response } from 'express';
import * as contractService from '../services/contractService';

export async function rentOut(req: Request, res: Response) {
  try {
    const { tokenId, renter, duration } = req.body as { tokenId: number; renter: string; duration: number };
    if (!tokenId || !renter || !duration) return res.status(400).json({ error: 'tokenId, renter, duration required' });
    const txHash = await contractService.rentOut(tokenId, renter, duration);
    return res.status(200).json({ txHash });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function returnToken(req: Request, res: Response) {
  try {
    const { tokenId } = req.body as { tokenId: number };
    if (!tokenId) return res.status(400).json({ error: 'tokenId required' });
    const txHash = await contractService.returnToken(tokenId);
    return res.status(200).json({ txHash });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function reclaimToken(req: Request, res: Response) {
  try {
    const { tokenId } = req.body as { tokenId: number };
    if (!tokenId) return res.status(400).json({ error: 'tokenId required' });
    const txHash = await contractService.reclaimToken(tokenId);
    return res.status(200).json({ txHash });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
} 