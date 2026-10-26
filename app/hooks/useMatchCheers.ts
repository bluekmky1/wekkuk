import { useEffect, useState } from "react";
import type { CommentSubmission } from "~/components/ui/CommentComposer";

export type MatchCheer = CommentSubmission & { id: string; author: string; createdAt: string };

function isMatchCheer(value: unknown): value is MatchCheer {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<MatchCheer>;
  return typeof item.id === "string" && typeof item.author === "string" && typeof item.content === "string"
    && typeof item.createdAt === "string" && !Number.isNaN(Date.parse(item.createdAt))
    && Array.isArray(item.attachments) && item.attachments.every((name) => typeof name === "string");
}

export function useMatchCheers(tournamentId: string, matchId: string) {
  const storageKey = `wekkuk-match-cheers:${tournamentId}:${matchId}`;
  const [state, setState] = useState<{ key: string; comments: MatchCheer[] }>({ key: "", comments: [] });
  const ready = state.key === storageKey;
  const comments = ready ? state.comments : [];

  useEffect(() => {
    let restored: MatchCheer[] = [];
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (Array.isArray(saved)) restored = saved.filter(isMatchCheer);
    } catch { /* Keep the preview usable when storage is unavailable. */ }
    setState({ key: storageKey, comments: restored });
  }, [storageKey]);

  function addComment(submission: CommentSubmission) {
    if (!ready) return;
    const comment: MatchCheer = { ...submission, id: crypto.randomUUID(), author: "글쓴이", createdAt: new Date().toISOString() };
    const next = [...comments, comment];
    setState({ key: storageKey, comments: next });
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* In-memory preview remains available. */ }
    return comment.id;
  }

  return { comments, ready, addComment };
}
