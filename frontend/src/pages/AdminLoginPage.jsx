import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { LOGO_URL, BRAND } from "../lib/brand";

export default function AdminLoginPage() {
  const { user, checking, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <div className="h-16 w-16 rounded-full overflow-hidden bg-white ring-1 ring-[var(--border)] shadow-sm mb-3">
            <img src={LOGO_URL} alt="Attouna" className="h-full w-full object-cover object-right" />
          </div>
          <div className="font-display font-bold text-xl text-navy">{BRAND.name}</div>
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
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="admin-login-password"
                />
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
