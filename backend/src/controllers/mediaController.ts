import { Request, Response } from 'express';
import * as contractService from '../services/contractService';
import crypto from 'crypto';
import { ethers } from 'ethers';

// Extend Request type to include file property from multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function registerMedia(req: MulterRequest, res: Response) {
  try {
    // Check if we have file upload data
    if (req.file) {
      // Handle file upload
      const file = req.file;
      const { title, description } = req.body;
      
      // Generate hash from file
      const hashHex = crypto.createHash('sha256').update(file.buffer).digest('hex');
      
      // Convert hex string to bytes32 format for smart contract
      // Ensure the hex string is properly formatted
      const cleanHash = hashHex.startsWith('0x') ? hashHex.slice(2) : hashHex;
      const hashBytes32 = ethers.zeroPadValue('0x' + cleanHash, 32);
      
      // Create metadata URI (in a real app, this would be uploaded to IPFS)
      const metadataURI = JSON.stringify({
        title: title || 'Untitled',
        description: description || '',
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date().toISOString()
      });
      
      const txHash = await contractService.registerMedia(hashBytes32, metadataURI);
      return res.status(200).json({ txHash, hashHex, metadataURI });
    } else {
      // Handle direct hashHex and metadataURI (for testing)
      const { hashHex, metadataURI } = req.body as { hashHex: string; metadataURI: string };
      if (!hashHex || !metadataURI) {
        return res.status(400).json({ error: 'hashHex and metadataURI required' });
      }

      // Convert hex string to bytes32 format for smart contract
      // Ensure the hex string is properly formatted
      const cleanHash = hashHex.startsWith('0x') ? hashHex.slice(2) : hashHex;
      const hashBytes32 = ethers.zeroPadValue('0x' + cleanHash, 32);

      const txHash = await contractService.registerMedia(hashBytes32, metadataURI);
      return res.status(200).json({ txHash });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
} 