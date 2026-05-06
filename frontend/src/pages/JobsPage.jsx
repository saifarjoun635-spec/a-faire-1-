import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  ArrowRight,
  Warehouse,
  Trees,
  BedDouble,
  Loader2,
  Inbox,
} from "lucide-react";
import PublicLayout from "../components/PublicLayout";
import ApplicationDialog from "../components/ApplicationDialog";
import { SECTOR_KEYS } from "../lib/brand";
import { useT } from "../lib/i18n";
import api from "../lib/api";

const sectorIcons = {
  entrepot: Warehouse,
  paysagerie: Trees,
  hotelier: BedDouble,
};

export default function JobsPage() {
  const { t } = useT();
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, job: null, sector: null });

  const filterSector = params.get("secteur") || "all";

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get("/jobs")
      .then(({ data }) => {
        if (mounted) setJobs(data);
      })
      .catch(() => {
        if (mounted) setJobs([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const g = { entrepot: [], paysagerie: [], hotelier: [] };
    jobs.forEach((j) => {
      if (g[j.sector]) g[j.sector].push(j);
    });
    return g;
  }, [jobs]);

  const visibleSectors = filterSector === "all" ? SECTOR_KEYS : SECTOR_KEYS.filter((k) => k === filterSector);

  return (
    <PublicLayout>
      <section className="bg-navy text-white px-4 sm:px-6 lg:px-8 py-16 md:py-24" data-testid="jobs-hero">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="gold-accent-line" />
            <span className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">
              {t("jobs.kicker")}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {t("jobs.title.1")} <span className="text-gold">{t("jobs.title.2")}</span>
          </h1>
          <p className="mt-5 text-white/70 max-w-2xl leading-relaxed">{t("jobs.subtitle")}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <FilterButton active={filterSector === "all"} onClick={() => setParams({})} testId="filter-all">
              {t("jobs.filter.all")}
            </FilterButton>
            {SECTOR_KEYS.map((k) => {
              const Icon = sectorIcons[k];
              return (
                <FilterButton
                  key={k}
                  active={filterSector === k}
                  onClick={() => setParams({ secteur: k })}
                  testId={`filter-${k}`}
                >
                  <Icon size={14} /> {t(`sectors.${k}.short`)}
                </FilterButton>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16" data-testid="jobs-section">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="animate-spin text-navy" size={32} />
              <div className="mt-3 text-sm text-[var(--text-secondary)]">{t("jobs.loading")}</div>
            </div>
          ) : (
            <div className="space-y-16">
              {visibleSectors.map((key) => {
                const Icon = sectorIcons[key];
                const sectorJobs = grouped[key];
                return (
                  <div key={key} data-testid={`sector-block-${key}`}>
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-6 pb-4 border-b-2 border-[var(--border)]">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-sm bg-navy text-gold grid place-items-center">
                          <Icon size={22} />
                        </div>
                        <div>
                          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                            {t(`sectors.${key}.label`)}
                          </h2>
                          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                            {sectorJobs.length}{" "}
                            {sectorJobs.length <= 1 ? t("jobs.count.singular") : t("jobs.count.plural")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDialog({ open: true, job: null, sector: key })}
                        className="btn-ghost-navy px-5 py-2.5 rounded-sm text-sm font-semibold"
                        data-testid={`sector-apply-${key}`}
                      >
                        {t("jobs.spontaneous")}
                      </button>
                    </div>

                    {sectorJobs.length === 0 ? (
                      <div className="flex items-center gap-3 p-6 bg-white rounded-sm border border-dashed border-[var(--border)] text-[var(--text-secondary)]">
                        <Inbox size={18} />
                        <span className="text-sm">{t("jobs.empty")}</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {sectorJobs.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            applyLabel={t("jobs.apply")}
                            onApply={() => setDialog({ open: true, job, sector: job.sector })}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <ApplicationDialog
        open={dialog.open}
        onOpenChange={(o) => setDialog((d) => ({ ...d, open: o }))}
        defaultSector={dialog.sector}
        job={dialog.job}
      />
    </PublicLayout>
  );
}

function FilterButton({ active, onClick, children, testId }) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition ${
        active
          ? "bg-gold text-white border-gold"
          : "border-white/30 text-white/80 hover:border-gold hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}

function JobCard({ job, onApply, applyLabel }) {
  return (
    <div className="card-soft rounded-sm p-6 flex flex-col" data-testid={`job-card-${job.id}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-gold">
          <Briefcase size={12} /> {job.job_type}
        </span>
      </div>
      <h3 className="font-display text-lg font-semibold text-navy mb-2 leading-snug">{job.title}</h3>
      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-3">
        <MapPin size={13} /> {job.location}
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-4 flex-1">
        {job.description}
      </p>
      <button
        onClick={onApply}
        className="mt-5 btn-navy px-4 py-2.5 rounded-sm text-sm font-semibold inline-flex items-center justify-center gap-2"
        data-testid={`job-${job.id}-apply-btn`}
      >
        {applyLabel} <ArrowRight size={14} />
      </button>
    </div>
  );
}
