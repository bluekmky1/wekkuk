import { Search } from "lucide-react";
import { PushLink } from "~/components/PushLink";

export function HomeSearchField() {
  return (
    <PushLink
      to="/search"
      aria-label="대회 검색 화면 열기"
      className="home-search-field flex h-[52px] items-center rounded-xl border-2 border-primary bg-neutral-white px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-text"
    >
      <span className="min-w-0 flex-1 text-body font-normal text-[#667085]">대회를 검색해보세요!</span>
      <span className="p-1 text-primary">
        <Search size={24} strokeWidth={2.3} aria-hidden="true" />
      </span>
    </PushLink>
  );
}
