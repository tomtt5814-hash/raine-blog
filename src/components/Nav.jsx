import { NavLink } from "react-router-dom";
import { profile } from "../data/site.js";

const links = [
  ["/", "首页"],
  ["/articles", "文章"],
  ["/interests", "兴趣"],
  ["/board", "流言板"],
];

export default function Nav({ theme, onToggleTheme }) {
  return (
    <header className="nav">
      <div className="nav-inner container">
        <NavLink to="/" className="brand" aria-label="回到首页">
          {profile.name}
          <span className="dot">.</span>
        </NavLink>

        <nav className="nav-links" aria-label="主要导航">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="theme-btn"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
          title={theme === "dark" ? "浅色模式" : "深色模式"}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M12 2.6v2.4M12 19v2.4M2.6 12H5M19 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
