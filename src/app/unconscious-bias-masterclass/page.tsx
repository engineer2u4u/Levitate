import type { Metadata } from "next";
import { DEIB_MASTERCLASS } from "@/lib/masterclass";
import Moved from "./Moved";

/**
 * The masterclass used to live here, before it was named for what it is.
 *
 * The page stays as a forwarder rather than disappearing: the old address was
 * live and may have been shared, and a static export leaves whatever it
 * published on the server — so an address that simply stopped being built
 * would keep serving the old page for ever. This one sends people on and
 * tells the crawlers which address is the real one.
 */
export const metadata: Metadata = {
  title: "DEIB Masterclass: Unconscious Bias at Work",
  description: "This masterclass has moved to /deib-masterclass/.",
  alternates: { canonical: DEIB_MASTERCLASS.path },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Moved to={DEIB_MASTERCLASS.path} />;
}
