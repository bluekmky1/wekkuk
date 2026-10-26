import type { NoticeContentBlock } from "~/data/notices";

export function NoticeDetail({ content }: { content: NoticeContentBlock[] }) {
  return <div className="space-y-8 px-5 py-5 text-body leading-5">
    {content.map((block, index) => {
      if (block.type === "paragraph") return <p key={`${index}-${block.text}`}>{block.text}</p>;
      if (block.type === "heading") return <h2 key={`${index}-${block.text}`} className="font-semibold">{block.text}</h2>;
      if (block.type === "numbered-list") return <ol key={index} className="list-decimal space-y-2 pl-5">{block.items.map((item) => <li key={item} className="whitespace-pre-line pl-1">{item}</li>)}</ol>;
      return <ul key={index} className="list-disc space-y-1 pl-5">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
    })}
  </div>;
}
