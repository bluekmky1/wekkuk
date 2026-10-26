import { useEffect, useState } from "react";
import { tournamentQuestions, type TournamentQuestion } from "~/data/tournament-details";

// Local prototype edits survive push/pop navigation; no server request is sent.
export function useTournamentQuestions(tournamentId: string) {
  const storageKey = `wekkuk-questions:${tournamentId}`;
  const [questions, setQuestions] = useState(tournamentQuestions);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let restored = tournamentQuestions;
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (Array.isArray(saved)) {
        const edits = saved.filter((item): item is TournamentQuestion => Boolean(item && typeof item.id === "string" && typeof item.title === "string" && typeof item.content === "string" && Array.isArray(item.comments)));
        const byId = new Map(edits.map((item) => [item.id, item]));
        restored = [...tournamentQuestions.map((item) => byId.get(item.id) ?? item), ...edits.filter((item) => !tournamentQuestions.some((original) => original.id === item.id))];
      }
    } catch { /* Local preview storage is optional. */ }
    setQuestions(restored);
    setReady(true);
  }, [storageKey]);

  function saveQuestions(next: TournamentQuestion[]) {
    setQuestions(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Keep the in-memory preview usable. */ }
  }
  return { questions, saveQuestions, ready };
}
