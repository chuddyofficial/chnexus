"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AnnouncementForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const message = (form.elements.namedItem("message") as HTMLInputElement)
      .value;
    const level = (form.elements.namedItem("level") as HTMLSelectElement)
      .value;

    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, level, active: true }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Failed to create announcement.");
    } else {
      form.reset();
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-xl border border-border bg-surface/60 p-5 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <input
          id="message"
          name="message"
          type="text"
          required
          maxLength={500}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="level" className="text-sm font-medium">
          Level
        </label>
        <select
          id="level"
          name="level"
          defaultValue="INFO"
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="INFO">Info</option>
          <option value="WARNING">Warning</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add"}
      </button>
      {error && <p className="text-sm text-danger sm:ml-3">{error}</p>}
    </form>
  );
}
