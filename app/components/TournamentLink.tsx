import type { ComponentProps } from "react";
import { PushLink } from "~/components/PushLink";

type TournamentLinkProps = Omit<ComponentProps<typeof PushLink>, "to"> & { tournamentId: string };

export function TournamentLink({ tournamentId, ...props }: TournamentLinkProps) {
  return <PushLink {...props} to={`/tournaments/${encodeURIComponent(tournamentId)}`} />;
}
