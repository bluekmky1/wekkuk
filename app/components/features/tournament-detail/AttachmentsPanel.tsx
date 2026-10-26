import { Download, FileText, Table2 } from "lucide-react";
import { Button, SectionHeader } from "~/components/ui";

export function AttachmentsPanel({ onDownload }: { onDownload: () => void }) {
  const attachments = [{ name: "대회요강", format: "PDF문서", Icon: FileText, color: "text-[#ff6464]" }, { name: "참가신청서", format: "Excel 문서 · XLSX", Icon: Table2, color: "text-[#55b971]" }];
  return <section aria-labelledby="attachments-heading" className="scroll-mt-[168px] pb-8 pt-6"><SectionHeader id="attachments-heading" title="첨부파일" count={attachments.length} className="mb-3" /><div className="space-y-3">{attachments.map(({ name, format, Icon, color }) => <Button key={name} variant="ghost" onClick={onDownload} aria-label={`${name} 다운로드`} className="flex min-h-[60px] w-full items-center gap-3 rounded-xl bg-neutral-surface px-4 py-3 text-left"><Icon size={24} className={color} aria-hidden="true" /><span className="flex-1"><span className="block text-body font-semibold">{name}</span><span className="mt-0.5 block text-caption">{format}</span></span><Download size={24} aria-hidden="true" /></Button>)}</div></section>;
}
