import { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

export function useConfirmDelete() {
  const [pending, setPending] = useState<{ action: () => void; all: boolean } | null>(null);
  const requestDelete = (action: () => void, all = false) => setPending({ action, all });
  const dialog = pending ? <Dialog title={pending.all ? "최근 검색을 모두 삭제할까요?" : "이 최근 검색을 삭제할까요?"} onClose={() => setPending(null)}>
    <p className="text-body text-neutral-subtext">{pending.all ? "저장된 최근 검색 기록이 모두 삭제됩니다." : "선택한 검색 기록이 삭제됩니다."}</p>
    <div className="mt-5 flex gap-2"><Button variant="outline" fullWidth onClick={() => setPending(null)}>취소</Button><Button fullWidth onClick={() => { pending.action(); setPending(null); }}>삭제</Button></div>
  </Dialog> : null;
  return { requestDelete, dialog };
}
