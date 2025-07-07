import { Request, Response } from 'express';
import * as contractService from '../services/contractService';

export async function registerEdition(req: Request, res: Response) {
  try {
    const { hashHex, metadataURI, amount } = req.body as { hashHex: string; metadataURI: string; amount: number };
    if (!hashHex || !metadataURI || !amount) {
      return res.status(400).json({ error: 'hashHex, metadataURI, amount required' });
    }
    const txHash = await contractService.registerEdition(hashHex, metadataURI, amount);
    return res.status(200).json({ txHash });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
} 