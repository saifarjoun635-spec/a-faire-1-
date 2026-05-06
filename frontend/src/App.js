import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import EmployersPage from "./pages/EmployersPage";
import { BlogPage, BlogPostPage } from "./pages/BlogPage";
import TermsPage from "./pages/TermsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { AuthProvider } from "./lib/auth";
import { I18nProvider } from "./lib/i18n";

function App() {
  return (
    <div className="App">
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/offres" element={<JobsPage />} />
              <Route path="/employeurs" element={<EmployersPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/conditions" element={<TermsPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </I18nProvider>
    </div>
  );
}

export default App;
