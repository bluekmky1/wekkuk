import { AppBar, ChipGroup, StickyHeader } from "~/components/ui";
import { noticeCategories } from "~/data/notices";

export function NoticeHeader({ category, onCategoryChange, onBack }: {
  category: (typeof noticeCategories)[number];
  onCategoryChange: (value: (typeof noticeCategories)[number]) => void;
  onBack: () => void;
}) {
  return <StickyHeader>
    <AppBar title="공지사항" onBack={onBack} />
    <ChipGroup
      label="공지사항 분류"
      items={noticeCategories.map((value) => ({ value, label: value }))}
      value={category}
      onChange={onCategoryChange}
      className="flex-nowrap gap-3 overflow-x-auto px-5 pb-5 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    />
  </StickyHeader>;
}
