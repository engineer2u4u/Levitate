import type { Metadata } from "next";
import ThankYou from "./ThankYou";

/**
 * Where a completed enquiry lands.
 *
 * noindex because it means nothing to anyone who has not just filled a form
 * in, and an ad platform counting conversions wants to see this address
 * reached rather than found.
 */
export const metadata: Metadata = {
  title: "Thank you",
  description: "Your enquiry has reached the Levitate PeopleSoft team.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThankYou />;
}
