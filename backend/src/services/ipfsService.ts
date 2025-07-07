import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import crypto from 'crypto';

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

export async function uploadBuffer(data: Buffer) {
  const { cid } = await ipfs.add(data);
  const hashHex = '0x' + crypto.createHash('sha256').update(data).digest('hex');
  return { cid: cid.toString(), hashHex };
} 