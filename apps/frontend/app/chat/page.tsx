"use client";
import React, { useState, useRef } from "react";

export default function Chat(): React.ReactElement {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setResponse("");
    setLoading(true);
    if (eventSourceRef.current !== null) {
      eventSourceRef.current.close();
    }
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"}/openai/chat?stream=true`;
    const es = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = es;
    es.onmessage = (event: MessageEvent) => {
      setResponse((prev) => prev + (event.data ?? ""));
    };
    es.onerror = () => {
      setLoading(false);
      es.close();
    };
    // Send prompt via fetch (to set cookies)
    await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
  };

  // Ensure operands for + are both strings or numbers
  const messageCount = String(response.split(" ").length) + " messages";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-4 bg-gray-100 rounded shadow"
      >
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value ?? "")}
          placeholder="Ask something..."
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={!!loading}
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
      <div className="w-full max-w-md mt-4 p-4 bg-gray-50 rounded shadow min-h-[100px]">
        <pre>{response}</pre>
        <div className="text-sm text-gray-500 mt-2">{messageCount}</div>
      </div>
    </main>
  );
}
