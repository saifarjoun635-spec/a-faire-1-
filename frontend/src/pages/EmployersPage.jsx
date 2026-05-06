import React, { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Clock,
  Handshake,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import PublicLayout from "../components/PublicLayout";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useT } from "../lib/i18n";
import api, { formatApiError } from "../lib/api";

const EMPTY = {
  company_name: "",
  contact_name: "",
  email: "",
  phone: "",
  sector: "",
  nb_positions: "1",
  urgency: "",
  description: "",
};

const SECTORS_EMP = ["entrepot", "paysagerie", "hotelier", "autre"];
const URGENCIES = ["immediate", "1-2_semaines", "1_mois", "flexible"];

export default function EmployersPage() {
  const { t } = useT();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/employer-requests", {
        ...form,
        nb_positions: parseInt(form.nb_positions, 10) || 1,
      });
      setSuccess(true);
      toast.success(t("employers.form.success.title"));
      setForm(EMPTY);
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail, t("employers.form.error.submit")));
    } finally {
      setLoading(false);
    }
  };

  const why = [
    { icon: UserCheck, t: t("employers.why.1.t"), d: t("employers.why.1.d") },
    { icon: Clock, t: t("employers.why.2.t"), d: t("employers.why.2.d") },
    { icon: ShieldCheck, t: t("employers.why.3.t"), d: t("employers.why.3.d") },
    { icon: Handshake, t: t("employers.why.4.t"), d: t("employers.why.4.d") },
  ];

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="bg-navy text-white px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative overflow-hidden" data-testid="employers-hero">
        <div className="absolute -right-32 -top-32 h-96 w-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="gold-accent-line" />
            <span className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">
              {t("employers.kicker")}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl">
            {t("employers.title.1")} <span className="text-gold">{t("employers.title.2")}</span>
          </h1>
          <p className="mt-5 text-white/70 max-w-2xl leading-relaxed">
            {t("employers.subtitle")}
          </p>
          <a
            href="#demande"
            className="mt-10 btn-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-sm text-sm font-semibold tracking-wide"
            data-testid="employers-cta"
          >
            <Building2 size={16} />
            {t("employers.cta")}
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* WHY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="employers-why">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="gold-accent-line" />
              <span className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">
                {t("employers.why.kicker")}
              </span>
              <span className="gold-accent-line" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
              {t("employers.why.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {why.map(({ icon: Icon, t: title, d }) => (
              <div key={title} className="card-soft rounded-sm p-6">
                <div className="h-12 w-12 rounded-sm bg-navy text-gold grid place-items-center mb-4">
                  <Icon size={20} />
                </div>
                <div className="font-display font-semibold text-navy mb-1">{title}</div>
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[var(--border)]" data-testid="employers-process">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="gold-accent-line" />
              <span className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">
                {t("employers.process.kicker")}
              </span>
              <span className="gold-accent-line" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
              {t("employers.process.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[1, 2, 3].map((n) => (
              <div key={n} className="relative">
                <div className="font-display text-7xl font-bold text-gold/20 leading-none mb-2">
                  0{n}
                </div>
                <div className="font-display text-lg font-semibold text-navy mb-2">
                  {t(`employers.process.${n}.t`)}
                </div>
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {t(`employers.process.${n}.d`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="demande" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-24" data-testid="employers-form-section">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="gold-accent-line" />
              <span className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">
                {t("employers.form.title")}
              </span>
              <span className="gold-accent-line" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
              {t("employers.form.title")}
            </h2>
            <p className="mt-3 text-[var(--text-secondary)]">{t("employers.form.subtitle")}</p>
          </div>

          {success ? (
            <div className="card-soft rounded-sm p-10 text-center" data-testid="employer-form-success">
              <div className="h-16 w-16 mx-auto rounded-full bg-green-50 grid place-items-center mb-4">
                <CheckCircle2 className="text-green-600" size={34} />
              </div>
              <h3 className="font-display text-2xl font-bold text-navy mb-2">
                {t("employers.form.success.title")}
              </h3>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                {t("employers.form.success.text")}
              </p>
              <Button className="mt-6 btn-navy" onClick={() => setSuccess(false)} data-testid="employer-form-reset">
                {t("form.close")}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="card-soft rounded-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4"
              data-testid="employer-form"
            >
              <div className="md:col-span-2">
                <Label>{t("employers.form.company")} *</Label>
                <Input
                  required
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  data-testid="employer-form-company"
                />
              </div>
              <div>
                <Label>{t("employers.form.contact")} *</Label>
                <Input
                  required
                  value={form.contact_name}
                  onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                  data-testid="employer-form-contact"
                />
              </div>
              <div>
                <Label>{t("employers.form.email")} *</Label>
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="employer-form-email"
                />
              </div>
              <div>
                <Label>{t("employers.form.phone")} *</Label>
                <Input
                  required
                  placeholder="514-000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  data-testid="employer-form-phone"
                />
              </div>
              <div>
                <Label>{t("employers.form.nbPositions")} *</Label>
                <Input
                  type="number"
                  min="1"
                  max="999"
                  required
                  value={form.nb_positions}
                  onChange={(e) => setForm({ ...form, nb_positions: e.target.value })}
                  data-testid="employer-form-nb"
                />
              </div>
              <div>
                <Label>{t("employers.form.sector")} *</Label>
                <Select
                  value={form.sector}
                  onValueChange={(v) => setForm({ ...form, sector: v })}
                >
                  <SelectTrigger data-testid="employer-form-sector"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    {SECTORS_EMP.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k === "autre" ? t("employers.form.sectorOther") : t(`sectors.${k}.label`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("employers.form.urgency")} *</Label>
                <Select
                  value={form.urgency}
                  onValueChange={(v) => setForm({ ...form, urgency: v })}
                >
                  <SelectTrigger data-testid="employer-form-urgency"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    {URGENCIES.map((u) => (
                      <SelectItem key={u} value={u}>
                        {t(`employers.form.urgency.${u}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>{t("employers.form.description")} *</Label>
                <Textarea
                  required
                  rows={5}
                  placeholder={t("employers.form.description.placeholder")}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  data-testid="employer-form-description"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading || !form.sector || !form.urgency}
                  className="btn-gold"
                  data-testid="employer-form-submit"
                >
                  {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                  {t("employers.form.submit")}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
