# PRD — Attouna Service Recruitment Site

## Original Problem Statement
Crée un site web de recrutement complet pour Attouna Service, une agence de placement de personnel basée à Montréal. Le site doit inclure une partie publique (accueil, offres d'emploi par 3 secteurs, formulaire de candidature avec CV PDF) et un espace admin protégé (CRUD offres, vue candidatures). Couleurs : #1a2f5a (bleu marine) et #c9a84c (or). Site 100% français.

## User Persona & Choices
- **Client/candidat** : visite site public, consulte offres par secteur, postule avec CV PDF
- **Admin (Attouna Service)** : gère les offres par secteur, consulte les candidatures et télécharge les CVs
- **Choix utilisateur** :
  - CV stockés en base64 dans MongoDB (pas d'object storage externe)
  - Pas de notifications email
  - Base de données vide au démarrage (admin ajoute ses offres)
  - Auth JWT + bcrypt (sécurisé)

## Architecture
- **Backend** : FastAPI + Motor (MongoDB async), bcrypt + PyJWT, admin seeded au startup
- **Frontend** : React 19 + React Router 7, Tailwind, Shadcn UI, Sonner toasts, Lucide icons
- **Auth** : Bearer JWT dans header Authorization, token en localStorage côté client
- **Secteurs** : `entrepot`, `paysagerie`, `hotelier`

## Implemented (2026-02)
- [x] Page d'accueil (Hero, À propos, Secteurs, Contact, Footer CNESST)
- [x] Page Offres d'emploi avec filtres par secteur + dialog de candidature
- [x] Upload CV PDF (validation type + taille 10 Mo)
- [x] Backend API complet (auth, jobs CRUD, applications)
- [x] Admin login + tableau de bord (tabs Offres / Candidatures)
- [x] CRUD offres avec switch actif/inactif
- [x] Vue candidature détaillée + téléchargement CV PDF + suppression
- [x] Design navy/or, typographies Cabinet Grotesk + Manrope, animations
- [x] Test credentials file + regression test suite (24/24 backend, 4/4 frontend)

## Key Endpoints
- `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/jobs` (public), `GET /api/jobs/all` (admin)
- `POST/PUT/DELETE /api/jobs/{id}` (admin)
- `POST /api/applications` (public, multipart), `GET /api/applications` (admin)
- `GET /api/applications/{id}/cv` (admin, retourne PDF)
- `DELETE /api/applications/{id}` (admin)

## Backlog / Next
- P1 : Notifications email à chaque candidature (Resend/SendGrid)
- P1 : Export CSV des candidatures depuis l'admin
- P2 : Recherche/filtres avancés sur les candidatures (par date, secteur, poste)
- P2 : Page "À propos" dédiée avec témoignages clients
- P2 : Intégration formulaire contact employeurs (demandes de personnel)
- P3 : Multilingue (EN) pour Montréal bilingue
- P3 : Object storage (S3-compatible) pour CV si volume croît > 1000
