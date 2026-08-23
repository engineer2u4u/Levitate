"use client";

import { useState } from "react";
import { recordQuizAttempt } from "@/lib/lms/enrolments";
import { passMarkFor } from "@/lib/lms/progress";
import type { Quiz as QuizType } from "@/lib/lms/types";

const CORRECT_XP = 20;
const STREAK_XP = 30;
const STREAK_AT = 3;

type Props = {
  quiz: QuizType;
  userId: string;
  courseSlug: string;
  onClose: () => void;
};

/** One stage's quiz: answer, reveal, explain, then a scored result. */
export default function Quiz({ quiz, userId, courseSlug, onClose }: Props) {
  const total = quiz.questions.length;
  const pass = passMarkFor(total);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gain, setGain] = useState(0);
  const [marks, setMarks] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const q = quiz.questions[index];
  const correct = revealed && picked === q.answer;

  const choose = (i: number) => {
    if (revealed) return;
    const ok = i === q.answer;
    const nextStreak = ok ? streak + 1 : 0;
    const earned = ok ? (nextStreak >= STREAK_AT ? STREAK_XP : CORRECT_XP) : 0;
    setPicked(i);
    setRevealed(true);
    setGain(earned);
    setScore((s) => s + (ok ? 1 : 0));
    setXp((x) => x + earned);
    setStreak(nextStreak);
    setBestStreak((b) => Math.max(b, nextStreak));
    setMarks((m) => [...m, ok]);
  };

  const next = () => {
    if (index + 1 < total) {
      setIndex(index + 1);
      setPicked(null);
      setRevealed(false);
      return;
    }
    // Only the best attempt is ever kept, so a retake can never cost XP.
    recordQuizAttempt(userId, courseSlug, quiz.stage, { score, total, xp, passed: score >= pass });
    setDone(true);
  };

  const retake = () => {
    setIndex(0); setPicked(null); setRevealed(false); setScore(0);
    setXp(0); setStreak(0); setGain(0); setMarks([]); setDone(false);
  };

  const passed = score >= pass;

  return (
    <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "28px 30px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        <div>
          <div style={{ font: "700 10.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 7 }}>
            Stage {quiz.stage} · {quiz.title}
          </div>
          <div style={{ font: "700 18px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>
            {done ? "Results" : `Question ${index + 1} of ${total}`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#136f6a", background: "rgba(47,196,188,.12)", border: "1px solid rgba(27,143,136,.3)", borderRadius: 999, padding: "7px 13px" }}>{xp} XP</div>
          {streak >= STREAK_AT && !done && (
            <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#9a7415", background: "rgba(240,160,44,.12)", border: "1px solid rgba(212,166,52,.5)", borderRadius: 999, padding: "7px 13px" }}>🔥 {streak} streak</div>
          )}
          <button type="button" onClick={onClose} style={{ cursor: "pointer", font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 999, padding: "8px 13px" }}>Close</button>
        </div>
      </div>

      {/* progress segments */}
      <div style={{ display: "flex", gap: 4, marginBottom: 22 }} aria-hidden>
        {quiz.questions.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: i < marks.length ? (marks[i] ? "#2fc4bc" : "#e2564a") : i === index && !done ? "#2f7fd6" : "#eef2f6" }} />
        ))}
      </div>

      {done ? (
        <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
          <div style={{ font: "700 34px 'Plus Jakarta Sans',sans-serif", color: passed ? "#136f6a" : "#9a7415" }}>{Math.round((score / total) * 100)}%</div>
          <div style={{ font: "700 19px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginTop: 8 }}>{passed ? "Stage cleared" : "Almost there"}</div>
          <p style={{ font: "400 13.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", maxWidth: 460, margin: "10px auto 20px" }}>
            {passed
              ? `You cleared ${quiz.title} and banked ${xp} XP towards your learner level.`
              : `You need ${pass} of ${total} correct to earn the ${quiz.badge} badge. Retake it — only your best attempt counts.`}
          </p>
          {passed && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(150deg,#fffaf0,#fff5e0)", border: "1px solid rgba(212,166,52,.45)", borderRadius: 14, padding: "12px 18px", marginBottom: 20 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#F6D982,#D4A634)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 15px 'Plus Jakarta Sans',sans-serif", color: "#4D3A05" }}>{quiz.glyph}</span>
              <span style={{ font: "700 13.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{quiz.badge} badge earned</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 22, justifyContent: "center", marginBottom: 22, flexWrap: "wrap" }}>
            {[
              { k: "Correct", v: `${score}/${total}` },
              { k: "XP earned", v: `+${xp}` },
              { k: "Best streak", v: String(bestStreak) },
            ].map((s) => (
              <div key={s.k}>
                <div style={{ font: "700 17px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{s.v}</div>
                <div style={{ font: "500 11px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>{s.k}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={retake} style={{ cursor: "pointer", background: "#f7fafc", border: "1px solid #e3eaf0", color: "#0a1b33", font: "700 13px 'Plus Jakarta Sans',sans-serif", padding: "12px 22px", borderRadius: 999 }}>Retake quiz</button>
            <button type="button" onClick={onClose} className="lp-btn-grad" style={{ cursor: "pointer", border: "none", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13px 'Plus Jakarta Sans',sans-serif", padding: "12px 22px", borderRadius: 999 }}>Back to the course</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ font: "700 17px/1.45 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 18 }}>{q.q}</div>
          <div role="radiogroup" aria-label="Answer options" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => {
              const right = i === q.answer;
              const isPicked = picked === i;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={isPicked}
                  disabled={revealed}
                  onClick={() => choose(i)}
                  style={{
                    cursor: revealed ? "default" : "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 13,
                    background: revealed ? (right ? "rgba(47,196,188,.1)" : isPicked ? "rgba(226,86,74,.08)" : "#fff") : "#fff",
                    border: `1px solid ${revealed ? (right ? "rgba(27,143,136,.6)" : isPicked ? "rgba(226,86,74,.5)" : "#e3eaf0") : "#e3eaf0"}`,
                    borderRadius: 13,
                    padding: "14px 16px",
                  }}
                >
                  <span style={{ width: 24, height: 24, flex: "none", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", font: "800 11px 'Plus Jakarta Sans',sans-serif", background: revealed ? (right ? "linear-gradient(135deg,#2fc4bc,#2f7fd6)" : isPicked ? "#e2564a" : "#f4f7f9") : "#f4f7f9", color: revealed && (right || isPicked) ? "#fff" : "#5b6e82" }}>
                    {"ABCD"[i]}
                  </span>
                  <span style={{ font: "500 13.5px/1.6 'Plus Jakarta Sans',sans-serif", color: revealed && !right && !isPicked ? "#8296a9" : "#0a1b33" }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {revealed && (
            <div role="status" style={{ marginTop: 16, background: correct ? "rgba(47,196,188,.08)" : "rgba(226,86,74,.06)", border: `1px solid ${correct ? "rgba(27,143,136,.3)" : "rgba(226,86,74,.28)"}`, borderRadius: 13, padding: "14px 16px" }}>
              <div style={{ font: "700 12.5px 'Plus Jakarta Sans',sans-serif", color: correct ? "#136f6a" : "#a53f28", marginBottom: 6 }}>
                {correct ? `Correct · +${gain} XP` : "Not quite"}
              </div>
              <div style={{ font: "400 13px/1.7 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{q.explanation}</div>
            </div>
          )}

          <button
            type="button"
            onClick={next}
            disabled={!revealed}
            className={revealed ? "lp-btn-grad" : undefined}
            style={{ width: "100%", marginTop: 18, cursor: revealed ? "pointer" : "not-allowed", border: "none", background: revealed ? "linear-gradient(120deg,#2fc4bc,#2f7fd6)" : "#eef2f6", color: revealed ? "#fff" : "#a9b8c6", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "13px 20px", borderRadius: 999 }}
          >
            {revealed ? (index + 1 < total ? "Next question →" : "See results →") : "Select an answer"}
          </button>
        </>
      )}
    </div>
  );
}
