import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Globe2, LogIn } from "lucide-react";
import { LOGO_URL } from "../lib/brand";
import { useT } from "../lib/i18n";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { lang, toggle, t } = useT();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const navItems = [
    { to: "/", label: t("nav.home"), testId: "nav-home-link" },
    { to: "/offres", label: t("nav.jobs"), testId: "nav-jobs-link" },
    { to: "/employeurs", label: t("nav.employers"), testId: "nav-employers-link" },
    { to: "/blog", label: t("nav.blog"), testId: "nav-blog-link" },
    {
      to: isHome ? "#apropos" : "/#apropos",
      label: t("nav.about"),
      testId: "nav-about-link",
      hash: true,
    },
    {
      to: isHome ? "#contact" : "/#contact",
      label: t("nav.contact"),
      testId: "nav-contact-link",
      hash: true,
    },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-[var(--border)]"
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0" data-testid="brand-home-link">
            <div className="h-14 w-14 bg-white rounded-sm grid place-items-center p-1 ring-1 ring-[var(--border)]">
              <img src={LOGO_URL} alt="Attouna Service" className="h-full w-full object-contain" />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {navItems.map((item) =>
              item.hash ? (
                <a
                  key={item.label}
                  href={item.to}
                  data-testid={item.testId}
                  className="link-hover text-sm font-medium tracking-wide text-[var(--text-secondary)] hover:text-navy"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  data-testid={item.testId}
                  className={({ isActive }) =>
                    `link-hover text-sm font-medium tracking-wide ${
                      isActive ? "text-navy" : "text-[var(--text-secondary)]"
                    } hover:text-navy`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={toggle}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-bold tracking-wider border border-[var(--border)] text-navy hover:bg-navy hover:text-white hover:border-navy transition-all"
              data-testid="lang-toggle"
              aria-label="Toggle language"
            >
              <Globe2 size={14} />
              {lang === "fr" ? "EN" : "FR"}
            </button>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-medium text-[var(--text-secondary)] hover:text-navy transition-colors"
              data-testid="nav-admin-link"
            >
              <LogIn size={14} />
              {t("nav.admin")}
            </Link>
            <Link
              to="/offres"
              className="btn-gold px-5 py-2.5 rounded-sm text-sm font-semibold tracking-wide"
              data-testid="header-cta-apply"
            >
              {t("nav.apply")}
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-navy"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 flex flex-col gap-1.5" data-testid="mobile-menu">
            {navItems.map((item) =>
              item.hash ? (
                <a
                  key={item.label}
                  href={item.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-sm text-sm font-medium text-[var(--text-secondary)] hover:bg-slate-100"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-sm text-sm font-medium ${
                      isActive ? "bg-navy text-white" : "text-[var(--text-secondary)] hover:bg-slate-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-sm text-sm font-medium text-[var(--text-secondary)] hover:bg-slate-100"
            >
              {t("nav.admin")}
            </Link>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  toggle();
                  setOpen(false);
                }}
                className="flex-1 py-2 rounded-sm text-xs font-bold border border-[var(--border)] text-navy"
              >
                {lang === "fr" ? "EN" : "FR"}
              </button>
              <Link
                to="/offres"
                onClick={() => setOpen(false)}
                className="flex-[2] btn-gold px-4 py-2 rounded-sm text-sm font-semibold text-center"
              >
                {t("nav.apply")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
