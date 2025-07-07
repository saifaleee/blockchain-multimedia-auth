import { Request, Response } from 'express';
import * as contractService from '../services/contractService';

export async function registerMedia(req: Request, res: Response) {
  try {
    const { hashHex, metadataURI } = req.body as { hashHex: string; metadataURI: string };
    if (!hashHex || !metadataURI) {
      return res.status(400).json({ error: 'hashHex and metadataURI required' });
    }

    const txHash = await contractService.registerMedia(hashHex, metadataURI);
    return res.status(200).json({ txHash });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
} 