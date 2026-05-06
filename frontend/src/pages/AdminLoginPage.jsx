import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { LOGO_URL } from "../lib/brand";

export default function AdminLoginPage() {
  const { user, checking, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--admin-bg)]">
        <Loader2 className="animate-spin text-navy" size={28} />
      </div>
    );
  }
  if (user) {
    const to = location.state?.from || "/admin";
    return <Navigate to={to} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) toast.error(res.error);
    else toast.success("Connecté.");
  };

  return (
    <div className="min-h-screen bg-[var(--admin-bg)] grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-48 w-48 overflow-hidden flex items-center justify-center mb-2">
            <img src={LOGO_URL} alt="Attouna" className="h-full w-full object-contain scale-[1.6]" />
          </div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold mt-1">
            Espace administrateur
          </div>
        </div>
        <Card className="border-[var(--border)]">
          <CardHeader>
            <CardTitle className="font-display text-navy">Connexion</CardTitle>
            <CardDescription>Accédez à votre tableau de bord.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4" data-testid="admin-login-form">
              <div>
                <Label htmlFor="email">Courriel</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="admin-login-email"
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    data-testid="admin-login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-sm text-[var(--text-secondary)] hover:text-navy hover:bg-slate-100 transition"
                    aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    data-testid="admin-login-password-toggle"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-navy"
                data-testid="admin-login-btn"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  <LogIn className="mr-2" size={16} />
                )}
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
