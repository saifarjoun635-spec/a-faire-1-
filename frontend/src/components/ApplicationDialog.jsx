import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Loader2, CheckCircle2, UploadCloud } from "lucide-react";
import { SECTORS } from "../lib/brand";
import api, { formatApiError } from "../lib/api";

const EMPTY = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  sector: "",
  cover_letter: "",
};

export default function ApplicationDialog({ open, onOpenChange, defaultSector, job }) {
  const [form, setForm] = useState({ ...EMPTY, sector: defaultSector || "" });
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync sector when the dialog is opened from a sector-specific entry point
  useEffect(() => {
    if (open) {
      setForm((f) => ({
        ...f,
        sector: defaultSector || f.sector || "",
      }));
    }
  }, [open, defaultSector]);

  const reset = () => {
    setForm({ ...EMPTY, sector: defaultSector || "" });
    setCv(null);
    setSuccess(false);
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      toast.error("Le CV doit être un fichier PDF.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("Le CV ne doit pas dépasser 10 Mo.");
      return;
    }
    setCv(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!cv) {
      toast.error("Veuillez joindre votre CV en PDF.");
      return;
    }
    if (!form.sector) {
      toast.error("Veuillez sélectionner un secteur.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (job?.id) fd.append("job_id", job.id);
      fd.append("cv", cv);
      await api.post("/applications", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      toast.success("Candidature envoyée !");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail, "Échec de l'envoi."));
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (o) => {
    onOpenChange(o);
    if (!o) setTimeout(reset, 250);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent
        className="max-w-2xl max-h-[92vh] overflow-y-auto"
        data-testid="application-dialog"
      >
        {success ? (
          <div className="py-10 flex flex-col items-center text-center" data-testid="application-success">
            <div className="h-16 w-16 rounded-full bg-green-50 grid place-items-center mb-4">
              <CheckCircle2 className="text-green-600" size={34} />
            </div>
            <h3 className="font-display text-2xl font-bold text-navy mb-2">
              Candidature envoyée !
            </h3>
            <p className="text-[var(--text-secondary)] max-w-md">
              Merci pour votre intérêt. Notre équipe examinera votre candidature
              et vous contactera dans les meilleurs délais.
            </p>
            <Button
              className="mt-6 btn-navy"
              onClick={() => handleOpen(false)}
              data-testid="application-success-close"
            >
              Fermer
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-navy">
                {job ? `Postuler : ${job.title}` : "Candidature spontanée"}
              </DialogTitle>
              <DialogDescription>
                Remplissez ce formulaire et joignez votre CV au format PDF.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="first_name">Prénom *</Label>
                <Input
                  id="first_name"
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  data-testid="application-first-name"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Nom *</Label>
                <Input
                  id="last_name"
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  data-testid="application-last-name"
                />
              </div>
              <div>
                <Label htmlFor="email">Courriel *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="application-email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  required
                  placeholder="514-000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  data-testid="application-phone"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Secteur visé *</Label>
                <Select
                  value={form.sector}
                  onValueChange={(v) => setForm({ ...form, sector: v })}
                >
                  <SelectTrigger data-testid="application-sector-trigger">
                    <SelectValue placeholder="Choisir un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((s) => (
                      <SelectItem key={s.key} value={s.key} data-testid={`sector-option-${s.key}`}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="cover_letter">Lettre de motivation *</Label>
                <Textarea
                  id="cover_letter"
                  required
                  rows={5}
                  placeholder="Présentez-vous en quelques lignes..."
                  value={form.cover_letter}
                  onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
                  data-testid="application-cover-letter"
                />
              </div>
              <div className="md:col-span-2">
                <Label>CV (PDF, max 10 Mo) *</Label>
                <label
                  htmlFor="cv-upload"
                  className="mt-1 flex items-center justify-center gap-3 border-2 border-dashed border-[var(--border)] rounded-sm px-4 py-6 cursor-pointer hover:border-gold transition"
                  data-testid="application-cv-dropzone"
                >
                  <UploadCloud className="text-navy" size={22} />
                  <span className="text-sm text-[var(--text-secondary)]">
                    {cv ? cv.name : "Cliquez pour téléverser votre CV"}
                  </span>
                </label>
                <input
                  id="cv-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFile}
                  className="hidden"
                  data-testid="application-cv-input"
                />
              </div>

              <DialogFooter className="md:col-span-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpen(false)}
                  data-testid="application-cancel-btn"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-gold"
                  data-testid="application-submit-btn"
                >
                  {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                  Envoyer ma candidature
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
