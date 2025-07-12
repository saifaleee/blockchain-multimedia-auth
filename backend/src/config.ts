import dotenv from 'dotenv';
import { ethers } from 'ethers';
import * as path from 'path';

// Load .env file from the backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// // Debug: Log environment variables
// console.log('Environment variables loaded:');
// console.log('RPC_URL:', process.env.RPC_URL);
// console.log('MEDIA_REGISTRY_ADDRESS:', process.env.MEDIA_REGISTRY_ADDRESS);
// console.log('EDITION_REGISTRY_ADDRESS:', process.env.EDITION_REGISTRY_ADDRESS);
// console.log('MARKETPLACE_ADDRESS:', process.env.MARKETPLACE_ADDRESS);
// console.log('RENTAL_ADDRESS:', process.env.RENTAL_ADDRESS);
// console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY ? 'Set' : 'Not set');

export const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
export const PRIVATE_KEY = process.env.PRIVATE_KEY || ethers.Wallet.createRandom().privateKey;

export const MEDIA_REGISTRY_ADDRESS = process.env.MEDIA_REGISTRY_ADDRESS || '';
export const EDITION_REGISTRY_ADDRESS = process.env.EDITION_REGISTRY_ADDRESS || '';
export const MARKETPLACE_ADDRESS = process.env.MARKETPLACE_ADDRESS || '';
export const RENTAL_ADDRESS = process.env.RENTAL_ADDRESS || '';

export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const wallet = new ethers.Wallet(PRIVATE_KEY, provider); 