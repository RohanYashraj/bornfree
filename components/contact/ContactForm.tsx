"use client";

import { useState } from "react";
import { siteConfig } from "@/content/site";

/**
 * Demo contact form — no backend is wired, so submissions open the user's
 * mail client addressed to the real support inbox.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Add your name and a short message.");
      return;
    }
    setError(null);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      "Website enquiry"
    )}&body=${body}`;
  };

  const inputClass =
    "w-full border border-border-spec bg-paper px-3 py-2.5 text-sm focus:border-carbon focus:outline-none";

  return (
    <form onSubmit={submit} noValidate className="max-w-md space-y-4">
      <label className="block">
        <span className="type-spec mb-1.5 block text-umber">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="type-spec mb-1.5 block text-umber">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="type-spec mb-1.5 block text-umber">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          className={inputClass}
        />
      </label>
      {error && (
        <p className="font-mono text-[11px] text-signal" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="type-spec w-full bg-olive py-3.5 text-paper transition-colors hover:bg-olive-deep"
      >
        Send message
      </button>
    </form>
  );
}
