import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

export const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
export const PRIVATE_KEY = process.env.PRIVATE_KEY || ethers.Wallet.createRandom().privateKey;

export const MEDIA_REGISTRY_ADDRESS = process.env.MEDIA_REGISTRY_ADDRESS || '';
export const EDITION_REGISTRY_ADDRESS = process.env.EDITION_REGISTRY_ADDRESS || '';
export const MARKETPLACE_ADDRESS = process.env.MARKETPLACE_ADDRESS || '';
export const RENTAL_ADDRESS = process.env.RENTAL_ADDRESS || '';

export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const wallet = new ethers.Wallet(PRIVATE_KEY, provider); 