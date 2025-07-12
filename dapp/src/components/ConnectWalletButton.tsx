"use client";
import { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { motion } from "framer-motion";
import { Wallet, Copy, Check, ExternalLink } from "lucide-react";
import { formatAddress } from "@/lib/utils";

export default function ConnectWalletButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const provider = await new Web3Modal().connect();
      const ethersProvider = new ethers.providers.Web3Provider(provider as any);
      const signer = await ethersProvider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
    } catch (err) {
      console.error("Wallet connection failed", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const disconnect = () => {
    setAddress(null);
  };

  if (address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            {formatAddress(address)}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyAddress}
            className="p-1 hover:bg-accent rounded transition-colors"
            title="Copy address"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={disconnect}
            className="p-1 hover:bg-destructive/10 rounded transition-colors"
            title="Disconnect"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={connectWallet}
      disabled={isConnecting}
      className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="h-4 w-4" />
      <span>
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </span>
      {isConnecting && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
        />
      )}
    </motion.button>
  );
} 