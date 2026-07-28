import { contact } from "@/lib/site";

export default function WhatsAppFloat() {
  return (
    <div style={{ position: "fixed", bottom: 26, right: 26, zIndex: 90, display: "flex", alignItems: "center", gap: 10 }}>
      <div className="lp-wa-tip" style={{ background: "#fff", color: "#0a1b33", font: "600 12px/1.3 'Plus Jakarta Sans',sans-serif", padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(47,196,188,.45)", boxShadow: "0 8px 24px rgba(10,27,51,.14)" }}>
        Chat with us on WhatsApp
      </div>
      <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" style={{ width: 54, height: 54, borderRadius: "50%", background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 2.6s infinite", boxShadow: "0 10px 26px rgba(10,27,51,.25)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 2a9.9 9.9 0 0 0-8.5 15.1L2 22l5.1-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.6l.4-.5a1.7 1.7 0 0 0 .3-.4.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.1 5 5 0 0 0 1 2.7 11.4 11.4 0 0 0 4.4 3.9 14.5 14.5 0 0 0 1.5.5 3.5 3.5 0 0 0 1.6.1 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3Z" />
        </svg>
      </a>
    </div>
  );
}
