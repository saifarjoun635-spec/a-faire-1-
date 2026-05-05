import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Users2,
  Handshake,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Warehouse,
  Trees,
  BedDouble,
} from "lucide-react";
import PublicLayout from "../components/PublicLayout";
import ApplicationDialog from "../components/ApplicationDialog";
import { BRAND, SECTORS } from "../lib/brand";

const sectorIcons = {
  entrepot: Warehouse,
  paysagerie: Trees,
  hotelier: BedDouble,
};

export default function HomePage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative hero-overlay text-white overflow-hidden" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative">
          <div className="max-w-3xl fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="gold-accent-line" />
              <span className="text-xs uppercase tracking-[0.28em] text-gold font-semibold">
                Agence de placement · Montréal
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Des talents fiables,
              <br />
              <span className="text-gold">pour des équipes qui performent.</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl">
              {BRAND.name} accompagne les entreprises du Québec dans leur
              recrutement en entrepôt, paysagerie et service hôtelier. Votre
              talent, notre priorité.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/offres"
                className="btn-gold px-7 py-3.5 rounded-sm text-sm font-semibold tracking-wide inline-flex items-center gap-2"
                data-testid="hero-view-jobs-btn"
              >
                Voir les offres
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => setDialogOpen(true)}
                className="px-7 py-3.5 rounded-sm text-sm font-semibold tracking-wide border-2 border-white/60 text-white hover:bg-white hover:text-navy transition-all"
                data-testid="hero-apply-btn"
              >
                Candidature spontanée
              </button>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl">
              {[
                { label: "Années d'expertise", value: "10+" },
                { label: "Secteurs servis", value: "3" },
                { label: "Candidats placés", value: "500+" },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-sm px-4 py-5">
                  <div className="font-display text-3xl font-bold text-gold">{s.value}</div>
                  <div className="text-xs text-white/70 uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8" data-testid="about-section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="gold-accent-line" />
              <span className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">
                À propos
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
              Une agence de placement à taille humaine, dévouée à votre réussite.
            </h2>
            <p className="mt-5 text-[var(--text-secondary)] leading-relaxed text-base">
              Basée à Montréal, {BRAND.name} est spécialisée dans le placement
              de personnel qualifié dans les domaines de l'entrepôt, de la
              paysagerie et du service hôtelier. Nous combinons rigueur,
              transparence et engagement pour bâtir des relations durables avec
              nos clients comme avec nos candidats.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: Users2, title: "Recrutement ciblé", text: "Des profils sélectionnés pour vos besoins opérationnels." },
                { icon: ShieldCheck, title: "Conformité CNESST", text: "Agence détentrice du permis AP-2604802." },
                { icon: Handshake, title: "Accompagnement continu", text: "Un interlocuteur dédié à chaque étape." },
                { icon: Sparkles, title: "Réactivité", text: "Placement rapide, dans les délais convenus." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="card-soft rounded-sm p-5">
                  <div className="h-10 w-10 rounded-sm bg-navy text-gold grid place-items-center mb-3">
                    <Icon size={18} />
                  </div>
                  <div className="font-display font-semibold text-navy mb-1">{title}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative fade-in-up">
            <div className="absolute -top-6 -left-6 h-40 w-40 border-4 border-gold rounded-sm hidden md:block" />
            <img
              src="https://images.unsplash.com/photo-1758518727077-ffb66ffccced?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80"
              alt="Équipe professionnelle"
              className="relative w-full h-[480px] object-cover rounded-sm shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-[var(--border)]" data-testid="sectors-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="gold-accent-line" />
              <span className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">
                Nos secteurs
              </span>
              <span className="gold-accent-line" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
              Trois domaines d'expertise
            </h2>
            <p className="mt-3 text-[var(--text-secondary)]">
              Une connaissance fine de chaque secteur pour un placement réussi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SECTORS.map((s) => {
              const Icon = sectorIcons[s.key];
              return (
                <Link
                  key={s.key}
                  to={`/offres?secteur=${s.key}`}
                  className="group relative rounded-sm overflow-hidden card-soft"
                  data-testid={`sector-card-${s.key}`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.label}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                      <Icon size={20} className="text-gold" />
                      <span className="text-xs uppercase tracking-[0.2em] font-semibold">
                        {s.short}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-navy mb-2">
                      {s.label}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                      {s.description}
                    </p>
                    <span className="text-sm text-gold font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Voir les offres <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="contact-banner">
        <div className="max-w-7xl mx-auto bg-navy text-white rounded-sm p-8 md:p-14 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 h-56 w-56 bg-gold/10 rounded-full blur-3xl" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="gold-accent-line" />
                <span className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">
                  Contactez-nous
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
                Parlons de vos besoins en recrutement.
              </h2>
              <p className="mt-4 text-white/70 leading-relaxed">
                Que vous soyez employeur ou candidat, notre équipe est à votre
                écoute pour bâtir la suite ensemble.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={`tel:${BRAND.phone}`}
                  className="btn-gold px-6 py-3 rounded-sm text-sm font-semibold"
                >
                  Appeler maintenant
                </a>
                <Link
                  to="/offres"
                  className="px-6 py-3 rounded-sm text-sm font-semibold border-2 border-white/60 hover:bg-white hover:text-navy transition"
                >
                  Consulter les offres
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: Phone, label: "Téléphone", value: BRAND.phone, href: `tel:${BRAND.phone}` },
                { icon: Mail, label: "Courriel", value: BRAND.email, href: `mailto:${BRAND.email}` },
                { icon: MapPin, label: "Adresse", value: BRAND.address },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 p-5 rounded-sm bg-white/5 border border-white/10">
                  <div className="h-10 w-10 rounded-sm bg-gold text-navy grid place-items-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/60">{label}</div>
                    {href ? (
                      <a href={href} className="text-white hover:text-gold font-medium break-all">
                        {value}
                      </a>
                    ) : (
                      <div className="text-white font-medium">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ApplicationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </PublicLayout>
  );
}
