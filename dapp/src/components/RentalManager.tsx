"use client";
import { useState } from "react";
import { API_BASE } from "@/lib/config";

export default function RentalManager() {
  const [tokenId, setTokenId] = useState<number>(0);
  const [renter, setRenter] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiCall = async (endpoint: string, payload: any) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/rental/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage(`${endpoint} success ✅`);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col gap-4 mt-8">
      <h1 className="text-2xl font-semibold mb-2">Rental Manager</h1>
      <input
        type="number"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(Number(e.target.value))}
        className="border rounded p-2"
      />
      <input
        type="text"
        placeholder="Renter Address"
        value={renter}
        onChange={(e) => setRenter(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="number"
        placeholder="Duration (seconds)"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        className="border rounded p-2"
      />
      <button
        onClick={() => apiCall("rent", { tokenId, renter, duration })}
        disabled={loading}
        className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? "Renting..." : "Rent Out"}
      </button>

      <hr className="my-4" />

      <button
        onClick={() => apiCall("return", { tokenId })}
        disabled={loading}
        className="bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 disabled:opacity-60"
      >
        {loading ? "Returning..." : "Return Token"}
      </button>

      <button
        onClick={() => apiCall("reclaim", { tokenId })}
        disabled={loading}
        className="bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Reclaiming..." : "Reclaim Token"}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
} 