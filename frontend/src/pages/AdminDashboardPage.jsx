import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  LogOut,
  Briefcase,
  Users,
  Plus,
  Pencil,
  Trash2,
  Download,
  Loader2,
  FileText,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuth } from "../lib/auth";
import api, { formatApiError, API } from "../lib/api";
import { BRAND, LOGO_URL, SECTORS, SECTOR_MAP } from "../lib/brand";

const EMPTY_JOB = {
  title: "",
  sector: "entrepot",
  job_type: "Temps plein",
  location: "Montréal, Qc",
  description: "",
  is_active: true,
};

export default function AdminDashboardPage() {
  const { user, checking, logout } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--admin-bg)]">
        <Loader2 className="animate-spin text-navy" size={28} />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--admin-bg)]">
      {/* Top bar */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-testid="admin-brand">
            <div className="h-9 w-9 rounded-full overflow-hidden bg-white">
              <img src={LOGO_URL} alt="" className="h-full w-full object-cover object-right" />
            </div>
            <div>
              <div className="font-display font-bold text-sm leading-tight">{BRAND.name}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gold">Tableau de bord</div>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-white/60">{user.email}</span>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
              onClick={logout}
              data-testid="admin-logout-btn"
            >
              <LogOut size={14} className="mr-2" /> Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-navy">Bienvenue</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Gérez les offres d'emploi et consultez les candidatures reçues.
          </p>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="bg-white border border-[var(--border)] p-1">
            <TabsTrigger value="jobs" data-testid="tab-jobs" className="data-[state=active]:bg-navy data-[state=active]:text-white px-5">
              <Briefcase size={14} className="mr-2" /> Offres d'emploi
            </TabsTrigger>
            <TabsTrigger value="applications" data-testid="tab-applications" className="data-[state=active]:bg-navy data-[state=active]:text-white px-5">
              <Users size={14} className="mr-2" /> Candidatures
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <JobsManager />
          </TabsContent>
          <TabsContent value="applications">
            <ApplicationsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ---------------- Jobs Manager ---------------- */
function JobsManager() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_JOB);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/jobs/all");
      setJobs(data);
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail, "Chargement échoué."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_JOB);
    setDialogOpen(true);
  };

  const openEdit = (job) => {
    setEditing(job);
    setForm({
      title: job.title,
      sector: job.sector,
      job_type: job.job_type,
      location: job.location,
      description: job.description,
      is_active: job.is_active,
    });
    setDialogOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/jobs/${editing.id}`, form);
        toast.success("Offre mise à jour.");
      } else {
        await api.post("/jobs", form);
        toast.success("Offre créée.");
      }
      setDialogOpen(false);
      await load();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail, "Enregistrement échoué."));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`/jobs/${toDelete.id}`);
      toast.success("Offre supprimée.");
      setToDelete(null);
      await load();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail, "Suppression échouée."));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-navy">Offres d'emploi</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {jobs.length} offre{jobs.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button className="btn-gold" onClick={openCreate} data-testid="admin-job-add-btn">
          <Plus size={16} className="mr-2" /> Nouvelle offre
        </Button>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-navy" /></div>
        ) : jobs.length === 0 ? (
          <div className="p-10 text-center text-sm text-[var(--text-secondary)]">
            Aucune offre. Cliquez sur "Nouvelle offre" pour commencer.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[var(--admin-bg)]">
                <TableHead>Titre</TableHead>
                <TableHead>Secteur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((j) => (
                <TableRow key={j.id} data-testid={`admin-job-row-${j.id}`}>
                  <TableCell className="font-medium text-navy max-w-xs truncate">{j.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-gold text-gold font-medium">
                      {SECTOR_MAP[j.sector]?.short || j.sector}
                    </Badge>
                  </TableCell>
                  <TableCell>{j.job_type}</TableCell>
                  <TableCell>{j.location}</TableCell>
                  <TableCell>
                    {j.is_active ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(j)} data-testid={`admin-job-edit-${j.id}`}>
                      <Pencil size={15} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setToDelete(j)} data-testid={`admin-job-delete-${j.id}`}>
                      <Trash2 size={15} className="text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl" data-testid="admin-job-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-navy">
              {editing ? "Modifier l'offre" : "Nouvelle offre"}
            </DialogTitle>
            <DialogDescription>
              Renseignez les informations pour l'affichage public.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label>Titre *</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-testid="admin-job-title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Secteur *</Label>
                <Select value={form.sector} onValueChange={(v) => setForm({ ...form, sector: v })}>
                  <SelectTrigger data-testid="admin-job-sector"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((s) => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type de poste *</Label>
                <Input
                  required
                  value={form.job_type}
                  onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                  data-testid="admin-job-type"
                />
              </div>
            </div>
            <div>
              <Label>Lieu *</Label>
              <Input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                data-testid="admin-job-location"
              />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                data-testid="admin-job-description"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-sm bg-[var(--admin-bg)]">
              <div>
                <Label className="mb-0">Offre active</Label>
                <div className="text-xs text-[var(--text-secondary)]">Visible sur le site public</div>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                data-testid="admin-job-active"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving} className="btn-navy" data-testid="admin-job-save">
                {saving && <Loader2 className="animate-spin mr-2" size={14} />}
                {editing ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette offre ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. "{toDelete?.title}" sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700" data-testid="admin-job-delete-confirm">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ---------------- Applications Manager ---------------- */
function ApplicationsManager() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications");
      setApps(data);
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail, "Chargement échoué."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const downloadCv = async (app) => {
    try {
      const token = localStorage.getItem("attouna_token");
      const res = await fetch(`${API}/applications/${app.id}/cv`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Téléchargement échoué");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = app.cv_filename || `CV-${app.last_name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error("Impossible de télécharger le CV.");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`/applications/${toDelete.id}`);
      toast.success("Candidature supprimée.");
      setToDelete(null);
      await load();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-navy">Candidatures reçues</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          {apps.length} candidature{apps.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-navy" /></div>
        ) : apps.length === 0 ? (
          <div className="p-10 text-center text-sm text-[var(--text-secondary)]">
            Aucune candidature reçue pour le moment.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[var(--admin-bg)]">
                <TableHead>Candidat</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Secteur</TableHead>
                <TableHead>Poste visé</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((a) => (
                <TableRow key={a.id} data-testid={`admin-app-row-${a.id}`}>
                  <TableCell className="font-medium text-navy">
                    {a.first_name} {a.last_name}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center gap-1"><Mail size={11} />{a.email}</div>
                      <div className="flex items-center gap-1"><Phone size={11} />{a.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-gold text-gold">
                      {SECTOR_MAP[a.sector]?.short || a.sector}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-xs truncate">
                    {a.job_title || <span className="text-[var(--text-secondary)] italic">Candidature spontanée</span>}
                  </TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">
                    {new Date(a.created_at).toLocaleDateString("fr-CA")}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => setView(a)} data-testid={`admin-app-view-${a.id}`}>
                      <FileText size={15} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => downloadCv(a)} data-testid={`admin-cv-download-${a.id}`}>
                      <Download size={15} className="text-gold" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setToDelete(a)}>
                      <Trash2 size={15} className="text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="admin-app-view">
          <DialogHeader>
            <DialogTitle className="font-display text-navy">
              {view?.first_name} {view?.last_name}
            </DialogTitle>
            <DialogDescription>Détail de la candidature</DialogDescription>
          </DialogHeader>
          {view && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <Info label="Courriel" value={view.email} />
                <Info label="Téléphone" value={view.phone} />
                <Info label="Secteur" value={SECTOR_MAP[view.sector]?.label || view.sector} />
                <Info label="Poste visé" value={view.job_title || "Candidature spontanée"} />
                <Info label="Date" value={new Date(view.created_at).toLocaleString("fr-CA")} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Lettre de motivation
                </div>
                <div className="p-4 bg-[var(--admin-bg)] rounded-sm text-sm whitespace-pre-wrap">
                  {view.cover_letter}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => downloadCv(view)} className="btn-gold">
                  <Download size={14} className="mr-2" /> Télécharger le CV
                </Button>
                <a href={`mailto:${view.email}`} className="inline-flex">
                  <Button variant="outline">
                    <ExternalLink size={14} className="mr-2" /> Contacter par courriel
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette candidature ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les données de {toDelete?.first_name} {toDelete?.last_name} seront définitivement supprimées, y compris le CV.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">{label}</div>
      <div className="text-navy font-medium mt-0.5 break-all">{value}</div>
    </div>
  );
}
