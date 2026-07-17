"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "success" | "error">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    // Demo build: no marketing backend wired — acknowledge locally.
    setState("success");
    setEmail("");
  };

  if (state === "success") {
    return (
      <p className="type-spec text-bone/80" role="status">
        You’re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex border border-bone/30">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          placeholder="Email address"
          className="w-full bg-transparent px-3 py-2.5 text-sm text-bone placeholder:text-bone/40 focus:outline-none"
        />
        <button
          type="submit"
          className="type-spec shrink-0 bg-bone px-4 text-carbon transition-colors hover:bg-khaki"
        >
          Join
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 font-mono text-[11px] text-signal" role="alert">
          Enter a valid email address.
        </p>
      )}
      <p className="mt-2 text-xs text-bone/50">
        New drops and offers. No noise.
      </p>
    </form>
  );
}
