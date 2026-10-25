import { profile } from "../data/site.js";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="brand small">
            {profile.name}
            <span className="dot">.</span>
          </div>
          <p className="muted">{profile.tagline}</p>
        </div>

        <div className="footer-links" aria-label="社交链接">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>

        <p className="footer-meta">© 2025 {profile.name} · 备案号占位</p>
      </div>
    </footer>
  );
}
