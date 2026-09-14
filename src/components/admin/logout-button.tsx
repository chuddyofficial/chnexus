"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      className="mt-2 text-sm text-muted transition-colors hover:text-danger"
    >
      Sign out
    </button>
  );
}
