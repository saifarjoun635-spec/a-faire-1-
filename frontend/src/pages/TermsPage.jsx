import React from "react";
import PublicLayout from "../components/PublicLayout";
import { ShieldCheck, FileText } from "lucide-react";
import { BRAND } from "../lib/brand";
import { useT } from "../lib/i18n";

export default function TermsPage() {
  const { t } = useT();
  const lastUpdated = "2026-02-06";

  return (
    <PublicLayout>
      <section className="bg-navy text-white px-4 sm:px-6 lg:px-8 py-16 md:py-24" data-testid="terms-hero">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="gold-accent-line" />
            <span className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">
              {t("terms.kicker")}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            {t("terms.title")}
          </h1>
          <p className="mt-4 text-white/70 text-sm">
            {t("terms.lastUpdated")} : {new Date(lastUpdated).toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16" data-testid="terms-body">
        <div className="max-w-4xl mx-auto space-y-10 text-[var(--text)] leading-relaxed text-base">
          <div className="card-soft rounded-sm p-6 flex items-start gap-4">
            <ShieldCheck className="text-gold shrink-0 mt-0.5" size={22} />
            <div className="text-sm text-[var(--text-secondary)]">
              {t("terms.intro")}
            </div>
          </div>

          {[
            { id: 1, titleKey: "terms.s1.title", bodyKey: "terms.s1.body" },
            { id: 2, titleKey: "terms.s2.title", bodyKey: "terms.s2.body" },
            { id: 3, titleKey: "terms.s3.title", bodyKey: "terms.s3.body" },
            { id: 4, titleKey: "terms.s4.title", bodyKey: "terms.s4.body" },
            { id: 5, titleKey: "terms.s5.title", bodyKey: "terms.s5.body" },
            { id: 6, titleKey: "terms.s6.title", bodyKey: "terms.s6.body" },
            { id: 7, titleKey: "terms.s7.title", bodyKey: "terms.s7.body" },
            { id: 8, titleKey: "terms.s8.title", bodyKey: "terms.s8.body" },
          ].map((s) => (
            <div key={s.id} data-testid={`terms-section-${s.id}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-display text-3xl font-bold text-gold/30">0{s.id}</span>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-navy">
                  {t(s.titleKey)}
                </h2>
              </div>
              <p className="text-[var(--text-secondary)] whitespace-pre-line">
                {t(s.bodyKey)}
              </p>
            </div>
          ))}

          <div className="card-soft rounded-sm p-6 flex items-start gap-4 mt-8">
            <FileText className="text-navy shrink-0 mt-0.5" size={22} />
            <div className="text-sm">
              <div className="font-display font-semibold text-navy mb-1">{t("terms.contact.title")}</div>
              <div className="text-[var(--text-secondary)]">
                {BRAND.name} — {BRAND.address}
                <br />
                <a href={`tel:${BRAND.phone}`} className="text-gold hover:underline">{BRAND.phone}</a> ·{" "}
                <a href={`mailto:${BRAND.email}`} className="text-gold hover:underline">{BRAND.email}</a>
                <br />
                {t("footer.permit")} : <strong className="text-navy">{BRAND.cnesst}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
