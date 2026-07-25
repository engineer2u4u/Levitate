import Link from "next/link";
import { contact, services } from "@/lib/site";

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

const head = { font: "700 13px 'Space Grotesk',sans-serif", color: "#0a1b33", letterSpacing: ".1em", textTransform: "uppercase" as const, marginBottom: 16 };
const col = { display: "flex", flexDirection: "column" as const, gap: 10, font: "500 13.5px 'Manrope',sans-serif" };

export default function SiteFooter() {
  return (
    <div className="site-sec" style={{ background: "#eef3f7", borderTop: "1px solid #dbe5ec", padding: "64px 48px 32px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div className="site-footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ background: "#fff", border: "1px solid #dbe5ec", borderRadius: 8, padding: "6px 12px", display: "inline-flex", marginBottom: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 30, display: "block" }} />
            </div>
            <p style={{ font: "400 13.5px/1.7 'Manrope',sans-serif", color: "#5b6e82", maxWidth: 320, margin: 0 }}>Elevating trainers, transforming workplaces and enabling human-centred change through practice-led certification and training.</p>
          </div>
          <div>
            <div style={head}>Services</div>
            <div style={col}>
              {services.map((s) => (
                <Link key={s.key} href={s.href} className="site-footlink">{s.short}</Link>
              ))}
            </div>
          </div>
          <div>
            <div style={head}>Company</div>
            <div style={col}>
              <Link href="/about" className="site-footlink">About Us</Link>
              <Link href="/certifications" className="site-footlink">Certification Programs</Link>
              <Link href="/" className="site-footlink">Home</Link>
              <Link href="/contact" className="site-footlink">Contact</Link>
            </div>
          </div>
          <div>
            <div style={head}>Contact</div>
            <div style={{ ...col, color: "#5b6e82" }}>
              <a href={`mailto:${contact.email}`} className="site-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 9 }}><MailIcon />{contact.email}</a>
              <a href={`tel:${contact.tel}`} className="site-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 9 }}><PhoneIcon />{contact.phone}</a>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 18, background: "#fff", border: "1px solid rgba(27,143,136,.4)", borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ width: 40, height: 40, flex: "none", borderRadius: "50%", border: "2px solid #2fc4bc", display: "flex", alignItems: "center", justifyContent: "center", font: "700 10px 'Space Grotesk',sans-serif", color: "#1b8f88" }}>ISO</div>
              <div>
                <div style={{ font: "700 13px 'Space Grotesk',sans-serif", color: "#0a1b33" }}>ISO Certified</div>
                <div style={{ font: "500 11.5px 'Manrope',sans-serif", color: "#5b6e82" }}>Quality-assured training organization</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #dbe5ec", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, font: "500 12.5px 'Manrope',sans-serif", color: "#8296a9" }}>
          <span>© 2026 Levitate PeopleSoft. All rights reserved.</span>
          <span>Founded 2023 · Built on HR legacy, strengthened by global practice</span>
        </div>
      </div>
    </div>
  );
}
