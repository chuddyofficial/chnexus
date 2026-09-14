"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function CreateAdminForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    email: string;
    qrCodeDataUrl: string;
    totpSecret: string;
  } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const role = (form.elements.namedItem("role") as HTMLSelectElement).value;

    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to create admin.");
    } else {
      setResult({
        email,
        qrCodeDataUrl: data.qrCodeDataUrl,
        totpSecret: data.totpSecret,
      });
      form.reset();
      router.refresh();
    }
    setLoading(false);
  }

  if (result) {
    return (
      <div className="rounded-xl border border-accent/40 bg-surface/60 p-6">
        <h3 className="font-semibold">Admin account created: {result.email}</h3>
        <p className="mt-2 text-sm text-muted">
          Have them scan this QR code into an authenticator app right now —
          it will not be shown again.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.qrCodeDataUrl}
          alt="TOTP QR code"
          className="mt-4 h-48 w-48 rounded-lg border border-border bg-white p-2"
        />
        <p className="mt-3 font-mono text-xs text-muted">
          Manual entry secret: {result.totpSecret}
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-4 rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-xl border border-border bg-surface/60 p-5 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="password" className="text-sm font-medium">
          Temporary password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={12}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="role" className="text-sm font-medium">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="ADMIN"
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="ADMIN">Admin</option>
          <option value="SUPERADMIN">Superadmin</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create admin"}
      </button>
      {error && <p className="text-sm text-danger sm:ml-3">{error}</p>}
    </form>
  );
}
