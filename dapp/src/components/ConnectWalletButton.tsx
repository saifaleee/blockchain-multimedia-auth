"use client";
import { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

export default function ConnectWalletButton() {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const provider = await new Web3Modal().connect();
      const ethersProvider = new ethers.providers.Web3Provider(provider as any);
      const signer = await ethersProvider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  };

  const label = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Connect Wallet";

  return (
    <button
      className="rounded bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white text-sm"
      onClick={connectWallet}
    >
      {label}
    </button>
  );
} 