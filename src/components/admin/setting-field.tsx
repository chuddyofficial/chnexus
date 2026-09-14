"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function SettingField({
  settingKey,
  label,
  placeholder,
  initialValue,
}: {
  settingKey: string;
  label: string;
  placeholder: string;
  initialValue: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: settingKey, value }),
    });

    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 rounded-xl border border-border bg-surface/60 p-4 sm:flex-row sm:items-center"
    >
      <label className="w-48 shrink-0 text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        placeholder={placeholder}
        className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={saving}
        className="rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-accent disabled:opacity-60"
      >
        {saving ? "Saving…" : saved ? "Saved" : "Save"}
      </button>
    </form>
  );
}
