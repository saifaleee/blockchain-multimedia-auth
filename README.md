# Blockchain-Based Multimedia Authentication System

## Overview
A full-stack application that registers, verifies, and trades multimedia assets using Ethereum smart-contracts, IPFS for decentralized storage, and a React/Next.js dApp frontend.

### Smart Contracts (Hardhat + Solidity)
* `MediaRegistry` – ERC-721 registry with royalty support.
* `MediaEditionRegistry` – ERC-1155 batch-mint editions.
* `MediaMarketplace` – list & purchase NFTs with automatic royalty payouts.
* `MediaRental` – time-limited rental of NFTs.

### Backend (Node/Express + TypeScript)
Exposes REST endpoints for:
* Registering singles & editions (`/media/register`, `/edition/register`).
* Listing & purchasing (`/marketplace/list`, `/marketplace/purchase`).
* Renting workflows (`/rental/*`).
* Uploads file to IPFS and returns content hash.

### Frontend (Next.js – to be implemented)
Wallet-connected dApp that interacts with backend & smart contracts.

## Local Development
```bash
# install deps
npm install

# run smart-contract tests
npm test

# run backend tests
npm run test:backend

# start hardhat node (optional)
npx hardhat node

# start backend API (port 4000)
npm run dev:backend
```

## Deployment
A Hardhat script in `scripts/deploy.js` deploys all contracts.

## Environment Variables
Copy `.env.example` and set:
```env
RPC_URL=
PRIVATE_KEY=
MEDIA_REGISTRY_ADDRESS=
EDITION_REGISTRY_ADDRESS=
MARKETPLACE_ADDRESS=
RENTAL_ADDRESS=
``` 