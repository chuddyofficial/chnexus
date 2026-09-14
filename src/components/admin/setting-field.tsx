"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function SettingField({
  settingKey,
  label,
  placeholder,
  initialValue,
  multiline = false,
}: {
  settingKey: string;
  label: string;
  placeholder: string;
  initialValue: string;
  multiline?: boolean;
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

  const inputClasses =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-surface/60 p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <label className="w-full shrink-0 pt-2 text-sm font-medium sm:w-48">
          {label}
        </label>
        <div className="flex-1">
          {multiline ? (
            <textarea
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setSaved(false);
              }}
              placeholder={placeholder}
              rows={3}
              className={inputClasses}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setSaved(false);
              }}
              placeholder={placeholder}
              className={inputClasses}
            />
          )}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="shrink-0 rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-accent disabled:opacity-60"
        >
          {saving ? "Saving…" : saved ? "Saved" : "Save"}
        </button>
      </div>
    </form>
  );
}
