"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Status = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

type Reply = {
  id: string;
  message: string;
  status: "SENT" | "FAILED";
  errorMessage: string | null;
  createdAt: string;
  admin: { email: string } | null;
};

const STATUS_STYLES: Record<Status, string> = {
  NEW: "border-accent/40 bg-accent/10 text-accent",
  READ: "border-border bg-surface text-muted",
  REPLIED: "border-success/40 bg-success/10 text-success",
  ARCHIVED: "border-border bg-surface/40 text-muted",
};

export function SubmissionRow({
  id,
  name,
  email,
  message,
  status,
  createdAt,
}: {
  id: string;
  name: string;
  email: string;
  message: string;
  status: Status;
  createdAt: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<Status>(status);
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState<Reply[] | null>(null);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  async function updateStatus(next: Status) {
    setUpdating(true);
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      setCurrent(next);
      router.refresh();
    }
    setUpdating(false);
  }

  async function loadReplies() {
    setLoadingReplies(true);
    const res = await fetch(`/api/admin/submissions/${id}/reply`);
    if (res.ok) {
      const data = await res.json();
      setReplies(data.replies);
    }
    setLoadingReplies(false);
  }

  function toggleExpanded() {
    setExpanded((v) => {
      const next = !v;
      if (next && replies === null) {
        loadReplies();
      }
      return next;
    });
  }

  async function onSendReply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);
    setSendError(null);

    const res = await fetch(`/api/admin/submissions/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: replyText }),
    });
    const data = await res.json();

    if (!res.ok) {
      setSendError(data.error ?? "Failed to send reply.");
      if (data.reply) {
        setReplies((prev) => [...(prev ?? []), data.reply]);
      }
    } else {
      setReplies((prev) => [...(prev ?? []), data.reply]);
      setReplyText("");
      setCurrent("REPLIED");
      router.refresh();
    }
    setSending(false);
  }

  return (
    <div className="rounded-xl border border-border bg-surface/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted">{email}</div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs ${STATUS_STYLES[current]}`}
          >
            {current}
          </span>
          <span className="text-xs text-muted">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
        {message}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(["NEW", "READ", "ARCHIVED"] as const)
          .filter((s) => s !== current)
          .map((s) => (
            <button
              key={s}
              type="button"
              disabled={updating}
              onClick={() => updateStatus(s)}
              className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-foreground disabled:opacity-60"
            >
              Mark {s.toLowerCase()}
            </button>
          ))}
        <button
          type="button"
          onClick={toggleExpanded}
          className="rounded-md border border-accent/40 px-3 py-1 text-xs text-accent transition-colors hover:bg-accent/10"
        >
          {expanded ? "Hide replies" : "Reply"}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-border pt-4">
          {loadingReplies && (
            <p className="text-xs text-muted">Loading replies…</p>
          )}

          {replies && replies.length > 0 && (
            <div className="space-y-2">
              {replies.map((r) => (
                <div
                  key={r.id}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-muted">
                    <span>{r.admin?.email ?? "Unknown admin"}</span>
                    <span className="flex items-center gap-2">
                      {r.status === "FAILED" && (
                        <span className="rounded-full border border-danger/40 px-2 py-0.5 text-danger">
                          Failed
                        </span>
                      )}
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {r.message}
                  </p>
                  {r.status === "FAILED" && r.errorMessage && (
                    <p className="mt-1 text-xs text-danger">
                      {r.errorMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={onSendReply} className="mt-3 space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${name}…`}
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            {sendError && <p className="text-xs text-danger">{sendError}</p>}
            <button
              type="submit"
              disabled={sending || !replyText.trim()}
              className="rounded-md bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send email reply"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
