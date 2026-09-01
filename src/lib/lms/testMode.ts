/**
 * Turns on the LMS surfaces that are not open to the public yet.
 *
 * A build-time flag rather than a branch difference. Keeping dev and main
 * identical in code means the testing switches cannot be merged into
 * production by accident, and a staging deploy is a matter of setting one
 * environment variable rather than remembering which branch is which.
 *
 * With it on: the LMS appears in the nav, the learner bar and its sign-in
 * button return to programme pages, and enrolment accepts payment through the
 * simulated gateway. Absent, everything behaves exactly as it does live.
 *
 * Set NEXT_PUBLIC_LMS_TESTING=1 in .env.local, which is gitignored.
 */
export const LMS_TESTING = process.env.NEXT_PUBLIC_LMS_TESTING === "1";
