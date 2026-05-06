import React from "react";
import { Phone, Mail, MapPin, ShieldCheck } from "lucide-react";
import { BRAND, LOGO_URL } from "../lib/brand";
import { useT } from "../lib/i18n";

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="bg-navy text-white mt-24" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-28 w-28 bg-white rounded-sm overflow-hidden flex items-center justify-center">
                <img src={LOGO_URL} alt="Attouna" className="h-full w-full object-contain scale-[1.6]" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">{BRAND.name}</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                  {BRAND.slogan}
                </div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{t("footer.about")}</p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-4">
              {t("footer.coords")}
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-gold mt-0.5 shrink-0" />
                <a href={`tel:${BRAND.phone}`} className="text-white/90 hover:text-gold transition" data-testid="footer-phone">
                  {BRAND.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-gold mt-0.5 shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="text-white/90 hover:text-gold transition break-all" data-testid="footer-email">
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-white/90" data-testid="footer-address">{BRAND.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-4">
              {t("footer.nav")}
            </div>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-white/80 hover:text-gold transition">{t("nav.home")}</a></li>
              <li><a href="/offres" className="text-white/80 hover:text-gold transition">{t("nav.jobs")}</a></li>
              <li><a href="/employeurs" className="text-white/80 hover:text-gold transition">{t("nav.employers")}</a></li>
              <li><a href="/blog" className="text-white/80 hover:text-gold transition">{t("nav.blog")}</a></li>
              <li><a href="/#apropos" className="text-white/80 hover:text-gold transition">{t("nav.about")}</a></li>
              <li><a href="/#contact" className="text-white/80 hover:text-gold transition">{t("nav.contact")}</a></li>
              <li><a href="/conditions" className="text-white/80 hover:text-gold transition">{t("terms.title")}</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-4">
              {t("footer.compliance")}
            </div>
            <div className="flex items-start gap-3 p-4 border border-white/15 rounded-sm bg-white/5" data-testid="footer-cnesst">
              <ShieldCheck size={20} className="text-gold shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  {t("footer.permit")}
                </div>
                <div className="font-display font-bold text-base tracking-wider">
                  {BRAND.cnesst}
                </div>
                <div className="text-xs text-white/60 mt-1">
                  {t("footer.permitSub")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} {BRAND.name}. {t("footer.rights")}</div>
          <div>{t("footer.compliant")}</div>
        </div>
      </div>
    </footer>
  );
}
