/**
 * Where the SHRM mark must not appear.
 *
 * Levitate PeopleSoft is a SHRM Recertification Provider, and the site says so
 * on its own account — in the ticker above every page and in the accreditation
 * band above the footer. But on a page selling a programme that earns no PDCs,
 * the same mark reads as a claim about that programme, whatever the words next
 * to it say. So those pages carry neither.
 *
 * Whether a programme earns PDCs is `certificate.shrm` on the course; this
 * list is for the site chrome, which is rendered above and below the page and
 * knows only the path.
 */
const NO_SHRM = ["/pocso-train-the-trainer-certification", "/lms/course/pocso-child-safety"];

export const hidesShrm = (path: string | null | undefined) =>
  Boolean(path) && NO_SHRM.some((p) => path === p || path === `${p}/` || (path as string).startsWith(`${p}/`));
