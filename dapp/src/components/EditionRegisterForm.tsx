"use client";
import { useState } from "react";
import { API_BASE } from "@/lib/config";

export default function EditionRegisterForm() {
  const [tokenId, setTokenId] = useState<number>(0);
  const [supply, setSupply] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/edition/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, supply }),
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage("Edition registered successfully 🎉");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto flex flex-col gap-4 mt-8"
    >
      <h1 className="text-2xl font-semibold mb-2">Register Edition</h1>
      <input
        type="number"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(Number(e.target.value))}
        className="border rounded p-2"
        required
      />
      <input
        type="number"
        placeholder="Supply"
        value={supply}
        onChange={(e) => setSupply(Number(e.target.value))}
        className="border rounded p-2"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
} 