import {
  CANVASES,
  CLOSING_NOTE,
  MASKS,
  MASK_COLORS,
  PLATES,
  fitBlock,
  parseRich,
  richWords,
  runsOf,
  wrap,
  wrapRich,
  type CertificateIssue,
  type MaskRegion,
} from "@/lib/certificateArt";

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Plus Jakarta Sans', 'Segoe UI', sans-serif";

/**
 * A specimen certificate, drawn over the finished artwork.
 *
 * The plate is the background; only the fields that change are drawn on top,
 * at coordinates measured from the reference. The plates still carry their
 * specimen text ("Your Name Here", the sample course), so each of those areas
 * is covered in the plate's own background colour before the real value is
 * written over it.
 */
export default function CertificatePlate({ issue }: { issue: CertificateIssue }) {
  const canvas = CANVASES[issue.template];
  return (
    <svg
      viewBox={`0 0 ${canvas.w} ${canvas.h}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "auto", background: "#fff" }}
      role="img"
      aria-label={`Specimen ${issue.template === "shrm" ? "SHRM certificate of completion" : "certificate of training completion"} for ${issue.courseName}`}
    >
      {issue.template === "shrm" ? <Shrm issue={issue} /> : <Excellence issue={issue} />}
    </svg>
  );
}

/** One patch over the plate's specimen text, in the plate's own background. */
function Patch({ r, fill }: { r: MaskRegion; fill: string; }) {
  return <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={r.id === "chip" ? 10 : 0} fill={fill} />;
}

/* -------------------------- A · SHRM, 1536 × 1024 ------------------------- */

const S = CANVASES.shrm;
const S_MID = S.w / 2;
const S_NAVY = "#1b3f88";
const S_INK = "#111111";

function Shrm({ issue }: { issue: CertificateIssue }) {
  const colors = MASK_COLORS.shrm;
  const M = Object.fromEntries(MASKS.shrm.map((r) => [r.id, r]));
  const courseLines = wrap(issue.courseName || "Course name", 52);
  // Fitted between the artwork's "Completed the" and "Offered by", both of
  // which are fixed. A long title tightens instead of colliding with them.
  const course = fitBlock(courseLines.length, 524, [38, 38, 26, 22], [32, 32, 23, 20]);

  return (
    <>
      <rect width={S.w} height={S.h} fill="#fff" />
      <image href={PLATES.shrm} x="0" y="0" width={S.w} height={S.h} preserveAspectRatio="none" />

      <Patch r={M.name} fill={colors.name} />
      <text x={S_MID} y="402" textAnchor="middle" fontFamily={SERIF} fontSize="60" fill={S_NAVY}>
        {issue.recipientName || "[Name of Recipient]"}
      </text>

      {/* Patches are pinned: the artwork's text never moves, so one that moved
          with the redrawn copy would slide off what it is there to hide. */}
      <Patch r={M.course} fill={colors.course} />
      {courseLines.map((line, i) => (
        <text key={i} x={S_MID} y={course.startY + i * course.step} textAnchor="middle" fontFamily={SERIF} fontSize={course.size} fontWeight="700" fill={S_NAVY}>
          {line}
        </text>
      ))}

      <Patch r={M.pdcs} fill={colors.pdcs} />
      <text x={S_MID} y="640" textAnchor="middle" fontFamily={SERIF} fontSize="27" fill={S_INK}>
        And has earned{" "}
        <tspan fontWeight="700" fill={S_NAVY}>{issue.pdcs || "[Number]"}</tspan>
        {" "}PDCs towards SHRM recertification
      </text>

      <text x="1038" y="672" textAnchor="middle" fontFamily={SERIF} fontSize="26" fontWeight="700" fill={S_NAVY}>
        {issue.completedOn}
      </text>
    </>
  );
}

/* ----------------------- B · Excellence, 1600 × 900 ----------------------- */

const E = CANVASES.excellence;
const E_PANEL = 398;
const E_MID = E_PANEL + (E.w - E_PANEL) / 2;
const E_INK = "#0d2748";
const E_TEAL = "#2f8f86";

function Excellence({ issue }: { issue: CertificateIssue }) {
  const colors = MASK_COLORS.excellence;
  const M = Object.fromEntries(MASKS.excellence.map((r) => [r.id, r]));

  // One flowed sentence — lead-in, title in bold, closing clause — because the
  // artwork sets the title on the same line as its lead-in. Laying them out as
  // separate blocks costs a line there is no room for.
  const bodyLines = wrapRich(
    [
      ...richWords("for satisfactorily completing the", false),
      ...richWords(issue.courseName || "Course name", true),
      ...parseRich(issue.closing ?? CLOSING_NOTE),
    ],
    58,
  );
  // The band between the rule under the name and the completed chip.
  const body = fitBlock(bodyLines.length, 434, [37, 37, 37, 31, 26], [21, 21, 21, 18, 16]);

  return (
    <>
      <rect width={E.w} height={E.h} fill="#fff" />
      <image href={PLATES.excellence} x="0" y="0" width={E.w} height={E.h} preserveAspectRatio="none" />

      <Patch r={M.name} fill={colors.name} />
      <text x={E_MID} y="332" textAnchor="middle" fontFamily={SERIF} fontSize="68" fontStyle="italic" fill={E_INK}>
        {issue.recipientName || "Your Name Here"}
      </text>

      {/* The whole paragraph is patched and redrawn, not just the title: in the
          artwork the course name shares its line with the lead-in, so there is
          no way to cover one without covering the other. */}
      <Patch r={M.course} fill={colors.course} />
      {bodyLines.map((line, i) => (
        <text key={i} x={E_MID} y={body.startY + i * body.step} textAnchor="middle" fontFamily={SANS} fontSize={body.size} fill="#3d4b5c">
          {runsOf(line).map((run, r) => (
            <tspan key={r} fontWeight={run.bold ? "700" : "400"} fill={run.bold ? E_INK : "#3d4b5c"}>
              {r ? " " : ""}
              {run.text}
            </tspan>
          ))}
        </text>
      ))}

      <Patch r={M.chip} fill={colors.chip} />
      <text x="776" y="543" fontFamily={SANS} fontSize="15" fontWeight="700" fill="#5b6b7c" letterSpacing="2.4">COMPLETED</text>
      <text x="950" y="543" fontFamily={SANS} fontSize="19" fontWeight="800" fill={E_INK}>{issue.completedOn || "—"}</text>
      <text x="1100" y="543" fontFamily={SANS} fontSize="18" fontWeight="400" fill="#c3cfdb">|</text>
      <text x="1124" y="543" fontFamily={SANS} fontSize="19" fontWeight="800" fill={E_TEAL}>{issue.hours || "—"}</text>

      {/* These two sit on the blue panel — hence the sampled colours. */}
      <Patch r={M.certId} fill={colors.certId} />
      <Patch r={M.issued} fill={colors.issued} />
      <text x="362" y="805" textAnchor="end" fontFamily={SANS} fontSize="17" fontWeight="800" fill="#ffffff">
        {issue.certificateId || "—"}
      </text>
      <text x="362" y="852" textAnchor="end" fontFamily={SANS} fontSize="17" fontWeight="800" fill="#ffffff">
        {issue.completedOn || "—"}
      </text>
    </>
  );
}
