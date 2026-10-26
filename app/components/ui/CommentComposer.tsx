import { PlusCircle, SendHorizontal, X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { IconButton } from "./Button";

export type CommentSubmission = { content: string; attachments: string[] };

export function CommentComposer({ disabled = false, onSubmit }: { disabled?: boolean; onSubmit: (comment: CommentSubmission) => void }) {
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (disabled || (!content && attachments.length === 0)) return;
    onSubmit({ content, attachments });
    setDraft(""); setAttachments([]);
    if (fileRef.current) fileRef.current.value = "";
  }

  return <footer className="fixed inset-x-0 bottom-0 z-30 w-full bg-neutral-border px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
    {attachments.length > 0 && <div className="mb-2 flex max-h-16 flex-wrap gap-1.5 overflow-y-auto">{attachments.map((name, index) => <span key={`${name}-${index}`} className="flex max-w-full items-center gap-1 rounded-lg bg-neutral-white pl-2 text-caption"><span className="truncate">{name}</span><IconButton label={`${name} 첨부 취소`} size="sm" onClick={() => setAttachments((items) => items.filter((_, itemIndex) => itemIndex !== index))}><X size={13} aria-hidden="true" /></IconButton></span>)}</div>}
    <form onSubmit={submit} className="flex items-center gap-2">
      <input ref={fileRef} type="file" multiple aria-label="댓글 파일 첨부" className="sr-only" disabled={disabled} onChange={(event) => setAttachments(Array.from(event.target.files ?? []).map((file) => file.name))} />
      <IconButton label="댓글 파일 첨부" size="sm" disabled={disabled} onClick={() => fileRef.current?.click()} className="text-neutral-subtext"><PlusCircle size={24} aria-hidden="true" /></IconButton>
      <input aria-label="댓글 내용" placeholder="댓글을 남겨주세요" value={draft} disabled={disabled} maxLength={1000} onChange={(event) => setDraft(event.target.value)} className="h-10 min-w-0 flex-1 rounded-full bg-neutral-white px-5 text-body outline-none placeholder:text-neutral-subtext focus-visible:ring-2 focus-visible:ring-neutral-text" />
      <IconButton type="submit" label="댓글 등록" size="sm" disabled={disabled || (!draft.trim() && attachments.length === 0)} className="text-neutral-subtext"><SendHorizontal size={26} aria-hidden="true" /></IconButton>
    </form>
  </footer>;
}
