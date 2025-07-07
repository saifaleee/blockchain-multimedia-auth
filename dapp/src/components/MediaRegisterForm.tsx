"use client";
import { useState } from "react";
import { API_BASE } from "@/lib/config";

export default function MediaRegisterForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please choose a file");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/media/register`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setMessage("Media registered successfully 🎉");
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (err: any) {
      console.error(err);
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
      <h1 className="text-2xl font-semibold mb-2">Register Media</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded p-2"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="file"
        accept="image/*,video/*,audio/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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
      {message && <p className="text-sm">{message}</p>}
    </form>
  );
} 