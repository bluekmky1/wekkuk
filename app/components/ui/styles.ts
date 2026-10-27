export function cx(...values: (string | false | undefined | null)[]) {
  return values.filter(Boolean).join(" ");
}

/** Supporting information in cards and article lists. */
export const metadataText = "text-caption font-normal text-neutral-subtext";

/** Shared compact shape for match preparation and change notices. */
export const compactBadge = "inline-block shrink-0 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-micro";
