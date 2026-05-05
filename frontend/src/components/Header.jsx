import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { LOGO_URL, BRAND } from "../lib/brand";

const navItems = [
  { to: "/", label: "Accueil", testId: "nav-home-link" },
  { to: "/offres", label: "Offres d'emploi", testId: "nav-jobs-link" },
  { to: "/admin", label: "Espace admin", testId: "nav-admin-link" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-xl border-b border-[var(--border)]"
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            data-testid="brand-home-link"
          >
            <div className="h-14 w-14 bg-white rounded-sm grid place-items-center p-1 ring-1 ring-[var(--border)]">
              <img
                src={LOGO_URL}
                alt="Attouna Service"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="font-display font-bold text-lg text-navy tracking-tight">
                {BRAND.name}
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                {BRAND.slogan}
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
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
            ))}
            <Link
              to="/offres"
              className="btn-gold px-5 py-2.5 rounded-sm text-sm font-semibold tracking-wide"
              data-testid="header-cta-apply"
            >
              Postuler
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-navy"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-2" data-testid="mobile-menu">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-sm text-sm font-medium ${
                    isActive
                      ? "bg-[var(--navy)] text-white"
                      : "text-[var(--text-secondary)] hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/offres"
              onClick={() => setOpen(false)}
              className="btn-gold px-4 py-2.5 rounded-sm text-sm font-semibold text-center"
            >
              Postuler
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
