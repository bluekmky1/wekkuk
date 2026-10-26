import { Link, useLocation } from "@remix-run/react";
import type { ComponentProps } from "react";

export function PushLink(props: Omit<ComponentProps<typeof Link>, "state">) {
  const location = useLocation();
  return <Link {...props} state={{ returnTo: `${location.pathname}${location.search}` }} />;
}
