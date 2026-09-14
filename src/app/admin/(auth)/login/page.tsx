"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { NexusMark } from "@/components/logos";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onCredentialsSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }

      if (data.mfaRequired) {
        setStep("mfa");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onMfaSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const code = (form.elements.namedItem("code") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/admin/verify-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Invalid code.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-grid relative flex min-h-[80vh] items-center justify-center px-4">
      <div className="glow-accent absolute inset-x-0 top-0 h-[400px]" />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface/80 p-8">
        <div className="flex flex-col items-center text-center">
          <NexusMark className="h-12 w-12" />
          <h1 className="mt-4 text-xl font-semibold">Admin Sign In</h1>
          <p className="mt-1 text-sm text-muted">
            Authorized personnel only.
          </p>
        </div>

        {step === "credentials" ? (
          <form onSubmit={onCredentialsSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        ) : (
          <form onSubmit={onMfaSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="code" className="text-sm font-medium">
                Authenticator code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                autoComplete="one-time-code"
                autoFocus
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-center text-lg tracking-widest outline-none focus:border-accent"
                placeholder="000000"
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
