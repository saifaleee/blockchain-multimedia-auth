import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import {
  provider,
  wallet,
  MEDIA_REGISTRY_ADDRESS,
  EDITION_REGISTRY_ADDRESS,
  MARKETPLACE_ADDRESS,
  RENTAL_ADDRESS,
} from '../config';

function loadArtifact(name: string) {
  const artifactPath = path.join(__dirname, `../../../artifacts/contracts/${name}.json`);
  if (!fs.existsSync(artifactPath)) throw new Error(`Artifact not found for ${name}`);
  return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
}

function getContract(address: string, artifactName: string) {
  const art = loadArtifact(artifactName);
  return new ethers.Contract(address, art.abi, wallet);
}

// Contracts
const mediaRegistry = MEDIA_REGISTRY_ADDRESS ? getContract(MEDIA_REGISTRY_ADDRESS, 'MediaRegistry.sol/MediaRegistry') : null;
const editionRegistry = EDITION_REGISTRY_ADDRESS ? getContract(EDITION_REGISTRY_ADDRESS, 'MediaEditionRegistry.sol/MediaEditionRegistry') : null;
const marketplace = MARKETPLACE_ADDRESS ? getContract(MARKETPLACE_ADDRESS, 'MediaMarketplace.sol/MediaMarketplace') : null;
const rental = RENTAL_ADDRESS ? getContract(RENTAL_ADDRESS, 'MediaRental.sol/MediaRental') : null;

// ---------- Registry ----------
export async function registerMedia(hashHex: string, metadataURI: string) {
  if (!mediaRegistry) throw new Error('MEDIA_REGISTRY_ADDRESS not configured');
  const tx = await mediaRegistry.registerMedia(hashHex, metadataURI);
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function registerEdition(hashHex: string, metadataURI: string, amount: number) {
  if (!editionRegistry) throw new Error('EDITION_REGISTRY_ADDRESS not configured');
  const tx = await editionRegistry.registerEdition(hashHex, metadataURI, amount);
  const receipt = await tx.wait();
  return receipt.hash;
}

// ---------- Marketplace ----------
export async function listToken(tokenId: number, priceWei: string) {
  if (!marketplace) throw new Error('MARKETPLACE_ADDRESS not configured');
  const tx = await marketplace.listToken(tokenId, priceWei);
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function purchaseToken(tokenId: number, valueWei: string) {
  if (!marketplace) throw new Error('MARKETPLACE_ADDRESS not configured');
  const tx = await marketplace.purchase(tokenId, { value: valueWei });
  const receipt = await tx.wait();
  return receipt.hash;
}

// ---------- Rental ----------
export async function rentOut(tokenId: number, renter: string, duration: number) {
  if (!rental) throw new Error('RENTAL_ADDRESS not configured');
  const tx = await rental.rentOut(tokenId, renter, duration);
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function returnToken(tokenId: number) {
  if (!rental) throw new Error('RENTAL_ADDRESS not configured');
  const tx = await rental.returnToken(tokenId);
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function reclaimToken(tokenId: number) {
  if (!rental) throw new Error('RENTAL_ADDRESS not configured');
  const tx = await rental.reclaim(tokenId);
  const receipt = await tx.wait();
  return receipt.hash;
} 