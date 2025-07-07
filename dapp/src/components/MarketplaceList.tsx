"use client";
import { useState } from "react";
import { API_BASE } from "@/lib/config";

export default function Marketplace() {
  const [tokenId, setTokenId] = useState<number>(0);
  const [priceWei, setPriceWei] = useState<string>("");
  const [valueWei, setValueWei] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const listToken = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/marketplace/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, priceWei }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage("Token listed ✅");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const purchaseToken = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/marketplace/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, valueWei }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage("Purchase transaction sent ✅");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col gap-4 mt-8">
      <h1 className="text-2xl font-semibold mb-2">Marketplace</h1>
      <input
        type="number"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(Number(e.target.value))}
        className="border rounded p-2"
      />
      <input
        type="text"
        placeholder="Price (wei)"
        value={priceWei}
        onChange={(e) => setPriceWei(e.target.value)}
        className="border rounded p-2"
      />
      <button
        onClick={listToken}
        disabled={loading}
        className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? "Listing..." : "List Token"}
      </button>
      <hr className="my-4" />
      <input
        type="text"
        placeholder="Value to send (wei)"
        value={valueWei}
        onChange={(e) => setValueWei(e.target.value)}
        className="border rounded p-2"
      />
      <button
        onClick={purchaseToken}
        disabled={loading}
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Purchasing..." : "Purchase Token"}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
} 