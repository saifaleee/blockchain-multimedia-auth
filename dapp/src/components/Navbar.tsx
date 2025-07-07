"use client";
import Link from "next/link";
import ConnectWalletButton from "@/components/ConnectWalletButton";

const navLinks = [
  { href: "/media/register", label: "Register Media" },
  { href: "/edition/register", label: "Register Edition" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/rental", label: "Rental" },
];

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-semibold">
        MediaAuth
      </Link>
      <div className="flex gap-6 items-center">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="hover:text-indigo-300 transition-colors text-sm"
          >
            {l.label}
          </Link>
        ))}
        <ConnectWalletButton />
      </div>
    </nav>
  );
} 