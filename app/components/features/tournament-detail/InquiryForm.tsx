import type { FormEventHandler } from "react";
import { Button } from "~/components/ui";

export function InquiryForm({ onSubmit }: { onSubmit: FormEventHandler<HTMLFormElement> }) {
  return <form onSubmit={onSubmit} className="space-y-4 text-body"><p className="text-caption text-neutral-subtext">화면 확인용 문의입니다. 실제 주최 측으로 전송되지 않습니다.</p><label className="block">문의 유형<select name="category" className="mt-1 h-10 w-full rounded-lg border border-neutral-border bg-neutral-white px-3"><option>기타</option><option>참가 문의</option><option>대진표 문의</option></select></label><label className="block">제목<input name="title" required maxLength={100} className="mt-1 h-10 w-full rounded-lg border border-neutral-border px-3" /></label><label className="block">내용<textarea name="content" required rows={4} className="mt-1 w-full resize-none rounded-lg border border-neutral-border p-3" /></label><label className="flex items-center gap-2"><input name="private" type="checkbox" defaultChecked className="accent-neutral-text" />비밀글로 작성</label><Button type="submit" variant="primary" fullWidth className="h-11 rounded-lg">미리보기 문의 추가</Button></form>;
}
