# 🎨 MediaAuth - Blockchain Multimedia Authentication Platform

A comprehensive Web3 platform for registering, trading, and verifying digital media assets on the blockchain. Built with Ethereum smart contracts, IPFS storage, and a modern React/Next.js frontend.

## ✨ Features

### 🔐 **Media Registration & Authentication**
- **Secure Upload**: Upload images, videos, and audio files (up to 100MB)
- **Blockchain Registration**: Creates SHA-256 hash and mints NFT on Ethereum
- **IPFS Storage**: Decentralized file storage with content addressing
- **Verification System**: Verify authenticity of any media file against blockchain records

### 🛒 **Decentralized Marketplace**
- **Advanced Search & Filtering**: Search by title, description, owner, media type, price range
- **Grid & List Views**: Flexible browsing experience
- **Real-time Data**: Live marketplace activity and trends
- **Secure Trading**: Buy and sell authenticated media with automatic royalty payouts

### 👑 **Limited Editions**
- **Exclusive Collections**: Create limited edition series from your registered media
- **Premium Pricing**: Set higher prices for exclusive editions
- **Special Features**: Add unique bonuses and features to editions
- **Supply Control**: Manage edition numbers and total supply

### ⏰ **Rental System**
- **Temporary Access**: Rent media for temporary use without full ownership
- **Flexible Pricing**: Time-based pricing for different durations
- **Revenue Stream**: Earn income by renting out your media
- **Rental Management**: Track active rentals and manage returns

### 📊 **Dashboard & Analytics**
- **Portfolio Overview**: Track total media, portfolio value, active listings
- **Transaction History**: Complete blockchain transaction records
- **Activity Feed**: Real-time marketplace activity and trends
- **Performance Metrics**: Monthly revenue, verification rates, user statistics

## 🏗️ Architecture

### **Smart Contracts (Solidity + Hardhat)**
- **`MediaRegistry`** - ERC-721 NFT registry with royalty support
- **`MediaEditionRegistry`** - ERC-1155 for limited edition collections
- **`MediaMarketplace`** - Decentralized marketplace with automatic royalty distribution
- **`MediaRental`** - Time-limited rental system with access control

### **Backend (Node.js + Express + TypeScript)**
- **RESTful API**: Complete CRUD operations for all features
- **File Processing**: Multer middleware for secure file uploads
- **IPFS Integration**: Automatic file pinning and hash generation
- **Blockchain Integration**: Smart contract interactions via ethers.js
- **Error Handling**: Comprehensive error handling and validation

### **Frontend (Next.js 14 + React 18 + TypeScript)**
- **Modern UI**: Tailwind CSS with custom components and animations
- **Wallet Integration**: MetaMask and other Web3 wallet support
- **Real-time Updates**: Live data fetching and state management
- **Responsive Design**: Mobile-first approach with responsive layouts
- **User Experience**: Intuitive navigation and smooth interactions

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- MetaMask or other Web3 wallet
- Ethereum testnet (Sepolia/Goerli) or local Hardhat network

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/blockchain-multimedia-auth.git
cd blockchain-multimedia-auth
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy environment template
cp .env.example .env

# Configure your environment
RPC_URL=your_ethereum_rpc_url
PRIVATE_KEY=your_deployment_private_key
MEDIA_REGISTRY_ADDRESS=deployed_contract_address
EDITION_REGISTRY_ADDRESS=deployed_contract_address
MARKETPLACE_ADDRESS=deployed_contract_address
RENTAL_ADDRESS=deployed_contract_address
```

4. **Deploy smart contracts**
```bash
# Deploy to local network
npm run deploy

# Or deploy to testnet
npm run deploy -- --network sepolia
```

5. **Start the backend server**
```bash
npm run dev:backend
```

6. **Start the frontend application**
```bash
cd dapp
npm run dev
```

## 📱 Application Pages

### **🏠 Home Page (`/`)**
- Platform overview and key features
- Call-to-action for getting started
- Professional landing page design

### **📊 Dashboard (`/dashboard`)**
- Portfolio overview with key metrics
- Recent media and transaction history
- Marketplace activity feed
- Tabbed interface for media, transactions, and overview

### **📤 Media Registration (`/media/register`)**
- Drag & drop file upload with preview
- Progress tracking with multiple stages
- Form validation and error handling
- Blockchain registration with NFT minting

### **🛒 Marketplace (`/marketplace`)**
- Advanced search and filtering
- Grid and list view modes
- Real-time marketplace data
- Buy and sell functionality

### **👑 Edition Registration (`/edition/register`)**
- Select from registered media files
- Configure edition parameters
- Set pricing and special features
- Create limited edition collections

### **⏰ Rental System (`/rental`)**
- Rent out your media for temporary access
- Browse available media for rental
- Manage active rentals and returns
- Time-based pricing and access control

### **🔍 Media Verification (`/verify`)**
- Upload any media file for verification
- Check authenticity against blockchain
- View original registration details
- Verify file integrity

## 🧪 Testing

```bash
# Run smart contract tests
npm test

# Run backend API tests
npm run test:backend

# Run frontend tests
cd dapp
npm test
```

## 🔧 Development

### **Backend Development**
```bash
# Start backend with hot reload
npm run dev:backend

# Run backend tests
npm run test:backend
```

### **Frontend Development**
```bash
cd dapp

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### **Smart Contract Development**
```bash
# Start local Hardhat node
npx hardhat node

# Deploy contracts locally
npm run deploy

# Run contract tests
npm test
```

## 🌐 API Endpoints

### **Media Management**
- `POST /media/register` - Register new media file
- `GET /media/user` - Get user's registered media
- `POST /media/verify` - Verify media authenticity

### **Marketplace**
- `GET /marketplace/items` - Get marketplace listings
- `POST /marketplace/list` - List item for sale
- `POST /marketplace/purchase` - Purchase marketplace item
- `GET /marketplace/activity` - Get marketplace activity

### **Dashboard**
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /transactions/user` - Get user's transaction history

### **Editions**
- `POST /edition/register` - Create limited edition

### **Rentals**
- `GET /rental/items` - Get rental listings
- `POST /rental/rent-out` - List item for rental
- `POST /rental/rent` - Rent an item
- `POST /rental/return` - Return rented item

## 🎨 UI/UX Features

### **Modern Design**
- **Tailwind CSS**: Utility-first styling with custom components
- **Framer Motion**: Smooth animations and transitions
- **Lucide Icons**: Consistent iconography throughout
- **Responsive Layout**: Mobile-first design approach

### **User Experience**
- **Loading States**: Skeleton screens and progress indicators
- **Error Handling**: Graceful error messages and recovery
- **Empty States**: Helpful guidance when no data is available
- **Navigation**: Intuitive breadcrumbs and back buttons

### **Interactive Elements**
- **Drag & Drop**: File upload with visual feedback
- **Real-time Updates**: Live data without page refreshes
- **Search & Filter**: Advanced filtering with instant results
- **Wallet Integration**: Seamless Web3 wallet connection

## 🔒 Security Features

### **Blockchain Security**
- **SHA-256 Hashing**: Cryptographic file verification
- **Smart Contract Validation**: On-chain ownership verification
- **Royalty Protection**: Automatic royalty distribution
- **Access Control**: Time-limited rental permissions

### **Data Protection**
- **IPFS Storage**: Decentralized, tamper-proof storage
- **Content Addressing**: Immutable file references
- **Private Key Management**: Secure wallet integration
- **Input Validation**: Comprehensive form validation

## 🚀 Deployment

### **Smart Contracts**
```bash
# Deploy to testnet
npm run deploy -- --network sepolia

# Deploy to mainnet
npm run deploy -- --network mainnet
```

### **Backend**
```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Frontend**
```bash
cd dapp

# Build for production
npm run build

# Deploy to Vercel/Netlify
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ethereum Foundation** for blockchain technology
- **IPFS** for decentralized storage
- **Hardhat** for smart contract development
- **Next.js** for the React framework
- **Tailwind CSS** for styling
- **Framer Motion** for animations

---

**Built with ❤️ for the Web3 community** 