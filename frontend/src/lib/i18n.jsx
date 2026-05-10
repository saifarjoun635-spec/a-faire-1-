import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const STORAGE_KEY = "attouna_lang";

export const dict = {
  fr: {
    // Nav
    "nav.home": "Accueil",
    "nav.jobs": "Offres d'emploi",
    "nav.employers": "Pour employeurs",
    "nav.blog": "Blog",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.admin": "Connexion",
    "nav.apply": "Postuler",

    // Brand
    "brand.tagline": "Agence de placement · Montréal",

    // Hero
    "hero.kicker": "Agence de placement · Montréal",
    "hero.title.1": "Des talents fiables,",
    "hero.title.2": "pour des équipes qui performent.",
    "hero.subtitle":
      "Attouna Services accompagne les entreprises du Québec dans leur recrutement en entrepôt, paysagerie et service hôtelier. Votre talent, notre priorité.",
    "hero.cta.jobs": "Voir les offres",
    "hero.cta.spontaneous": "Candidature spontanée",
    "hero.stat.years": "Années d'expertise",
    "hero.stat.sectors": "Secteurs servis",
    "hero.stat.placed": "Candidats placés",

    // About
    "about.kicker": "À propos",
    "about.title": "Une agence de placement à taille humaine, dévouée à votre réussite.",
    "about.text":
      "Basée à Montréal, Attouna Services est spécialisée dans le placement de personnel qualifié dans les domaines de l'entrepôt, de la paysagerie et du service hôtelier. Nous combinons rigueur, transparence et engagement pour bâtir des relations durables avec nos clients comme avec nos candidats.",
    "about.feat.1.t": "Recrutement ciblé",
    "about.feat.1.d": "Des profils sélectionnés pour vos besoins opérationnels.",
    "about.feat.2.t": "Conformité CNESST",
    "about.feat.2.d": "Agence détentrice du permis AP-2604802.",
    "about.feat.3.t": "Accompagnement continu",
    "about.feat.3.d": "Un interlocuteur dédié à chaque étape.",
    "about.feat.4.t": "Réactivité",
    "about.feat.4.d": "Placement rapide, dans les délais convenus.",

    // Sectors
    "sectors.kicker": "Nos secteurs",
    "sectors.title": "Trois domaines d'expertise",
    "sectors.subtitle": "Une connaissance fine de chaque secteur pour un placement réussi.",
    "sectors.entrepot.label": "Travail en entrepôt",
    "sectors.entrepot.short": "Entrepôt",
    "sectors.entrepot.desc": "Cariste, manutentionnaire, préparation de commandes, emballage et expédition.",
    "sectors.paysagerie.label": "Entretien extérieur / Paysagerie",
    "sectors.paysagerie.short": "Paysagerie",
    "sectors.paysagerie.desc": "Tonte, taille, aménagement paysager, déneigement et entretien saisonnier.",
    "sectors.hotelier.label": "Service hôtelier",
    "sectors.hotelier.short": "Hôtelier",
    "sectors.hotelier.desc": "Préposé·e aux chambres, entretien ménager, accueil et service en salle.",
    "sectors.viewOffers": "Voir les offres",

    // Contact
    "contact.kicker": "Nous contacter",
    "contact.title": "Parlons de vos besoins en recrutement.",
    "contact.subtitle":
      "Que vous soyez employeur ou candidat, notre équipe est à votre écoute pour bâtir la suite ensemble.",
    "contact.callNow": "Appeler maintenant",
    "contact.viewJobs": "Consulter les offres",
    "contact.phone": "Téléphone",
    "contact.email": "Courriel",
    "contact.address": "Adresse",

    // Footer
    "footer.about":
      "Agence de placement de personnel. Nous connectons talents et entreprises avec rigueur et dévouement.",
    "footer.coords": "Coordonnées",
    "footer.nav": "Navigation",
    "footer.compliance": "Conformité",
    "footer.permit": "Permis CNESST",
    "footer.permitSub": "Agence de placement de personnel",
    "footer.rights": "Tous droits réservés.",
    "footer.compliant": "Site conforme aux normes CNESST du Québec.",

    // Jobs page
    "jobs.kicker": "Offres d'emploi",
    "jobs.title.1": "Trouvez l'emploi",
    "jobs.title.2": "qui vous ressemble.",
    "jobs.subtitle": "Explorez nos postes ouverts dans trois secteurs clés. Postulez en quelques clics avec votre CV.",
    "jobs.filter.all": "Tous les secteurs",
    "jobs.loading": "Chargement des offres...",
    "jobs.count.singular": "offre disponible",
    "jobs.count.plural": "offres disponibles",
    "jobs.empty": "Aucune offre active pour le moment. Vous pouvez envoyer une candidature spontanée.",
    "jobs.spontaneous": "Candidature spontanée",
    "jobs.apply": "Postuler",

    // Application form
    "form.application.title": "Candidature spontanée",
    "form.application.titleJob": "Postuler :",
    "form.application.subtitle": "Remplissez ce formulaire et joignez votre CV au format PDF.",
    "form.firstName": "Prénom",
    "form.lastName": "Nom",
    "form.email": "Courriel",
    "form.phone": "Téléphone",
    "form.sector": "Secteur visé",
    "form.sector.choose": "Choisir un secteur",
    "form.coverLetter": "Lettre de motivation",
    "form.coverLetter.placeholder": "Présentez-vous en quelques lignes...",
    "form.cv": "CV (PDF, max 10 Mo)",
    "form.cv.hint": "Cliquez pour téléverser votre CV",
    "form.cancel": "Annuler",
    "form.submit": "Envoyer ma candidature",
    "form.success.title": "Candidature envoyée !",
    "form.success.text":
      "Merci pour votre intérêt. Notre équipe examinera votre candidature et vous contactera dans les meilleurs délais.",
    "form.close": "Fermer",
    "form.error.pdf": "Le CV doit être un fichier PDF.",
    "form.error.size": "Le CV ne doit pas dépasser 10 Mo.",
    "form.error.cv": "Veuillez joindre votre CV en PDF.",
    "form.error.sector": "Veuillez sélectionner un secteur.",
    "form.error.submit": "Échec de l'envoi.",
    "form.success.toast": "Candidature envoyée !",

    // Employers page
    "employers.kicker": "Pour les employeurs",
    "employers.title.1": "Trouvez le bon talent,",
    "employers.title.2": "rapidement et sans tracas.",
    "employers.subtitle":
      "Vous recherchez du personnel fiable pour votre entreprise ? Décrivez vos besoins, nous vous proposons des candidats qualifiés.",
    "employers.cta": "Demander du personnel",
    "employers.why.kicker": "Pourquoi nous choisir",
    "employers.why.title": "Un partenaire de confiance pour votre recrutement.",
    "employers.why.1.t": "Candidats pré-qualifiés",
    "employers.why.1.d": "Profils vérifiés et adaptés à votre secteur.",
    "employers.why.2.t": "Délai express",
    "employers.why.2.d": "Réponse sous 24 à 48 heures, placement rapide.",
    "employers.why.3.t": "Conformité CNESST",
    "employers.why.3.d": "Agence détentrice du permis AP-2604802.",
    "employers.why.4.t": "Accompagnement",
    "employers.why.4.d": "Un interlocuteur unique du brief au placement.",
    "employers.process.kicker": "Notre processus",
    "employers.process.title": "Comment ça marche",
    "employers.process.1.t": "Vous nous décrivez vos besoins",
    "employers.process.1.d": "Postes, profils recherchés, délais, contraintes.",
    "employers.process.2.t": "Nous identifions les talents",
    "employers.process.2.d": "Sélection, entretiens, vérifications.",
    "employers.process.3.t": "Vous recrutez en confiance",
    "employers.process.3.d": "Présentation des candidats, suivi du placement.",
    "employers.form.title": "Demande de personnel",
    "employers.form.subtitle":
      "Remplissez ce formulaire — nous vous recontactons sous 48 h.",
    "employers.form.company": "Nom de l'entreprise",
    "employers.form.contact": "Personne-ressource",
    "employers.form.email": "Courriel professionnel",
    "employers.form.phone": "Téléphone",
    "employers.form.sector": "Secteur",
    "employers.form.sectorOther": "Autre",
    "employers.form.nbPositions": "Nombre de postes",
    "employers.form.urgency": "Urgence",
    "employers.form.urgency.immediate": "Immédiate",
    "employers.form.urgency.1-2_semaines": "1 à 2 semaines",
    "employers.form.urgency.1_mois": "Sous 1 mois",
    "employers.form.urgency.flexible": "Flexible",
    "employers.form.description": "Description du besoin",
    "employers.form.description.placeholder":
      "Tâches, horaires, exigences particulières, durée du contrat...",
    "employers.form.submit": "Envoyer ma demande",
    "employers.form.success.title": "Demande envoyée !",
    "employers.form.success.text":
      "Merci. Notre équipe vous contactera sous 48 heures pour discuter de vos besoins.",
    "employers.form.error.submit": "Échec de l'envoi de la demande.",

    // Admin
    "admin.welcome": "Bienvenue",
    "admin.subtitle": "Gérez les offres d'emploi, candidatures et demandes employeurs.",
    "admin.tab.jobs": "Offres d'emploi",
    "admin.tab.applications": "Candidatures",
    "admin.tab.employers": "Demandes employeurs",
    "admin.logout": "Déconnexion",

    // Common
    "common.required": "*",
    "common.fr": "FR",
    "common.en": "EN",

    // Blog
    "blog.kicker": "Blog & conseils",
    "blog.title.1": "Insights et conseils",
    "blog.title.2": "pour recruter mieux.",
    "blog.subtitle":
      "Retrouvez nos analyses, bonnes pratiques et tendances du marché de l'emploi au Québec.",
    "blog.read": "Lire l'article",
    "blog.back": "Retour au blog",

    // Terms
    "terms.kicker": "Mentions légales",
    "terms.title": "Conditions d'utilisation",
    "terms.lastUpdated": "Dernière mise à jour",
    "terms.intro":
      "En accédant à ce site, vous acceptez les présentes conditions d'utilisation. Elles encadrent votre navigation, l'usage des formulaires de candidature et de demande employeur, ainsi que le traitement de vos données personnelles par Attouna Services.",
    "terms.s1.title": "Objet du site",
    "terms.s1.body":
      "Le site attounaservice.ca a pour objet de présenter les services de placement de personnel d'Attouna Services, de publier des offres d'emploi et de permettre aux candidats et employeurs d'entrer en contact avec l'agence. Les informations publiées sont fournies à titre indicatif.",
    "terms.s2.title": "Collecte et usage des données personnelles",
    "terms.s2.body":
      "Les données transmises via les formulaires (candidature ou demande employeur) sont utilisées exclusivement par Attouna Services pour traiter votre demande. Elles ne sont ni vendues, ni cédées à des tiers. Les CV sont stockés de façon sécurisée et conservés pendant une durée maximale de 24 mois, sauf demande de suppression anticipée.",
    "terms.s3.title": "Droit d'accès, de rectification et de suppression",
    "terms.s3.body":
      "Conformément aux lois québécoises sur la protection des renseignements personnels, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, écrivez à info@attounaservice.ca en précisant l'objet de votre demande.",
    "terms.s4.title": "Propriété intellectuelle",
    "terms.s4.body":
      "L'ensemble du contenu du site (logos, textes, graphismes, images) est la propriété d'Attouna Services ou de ses partenaires. Toute reproduction, diffusion ou adaptation sans autorisation écrite préalable est interdite.",
    "terms.s5.title": "Cookies et statistiques",
    "terms.s5.body":
      "Le site utilise un stockage local (localStorage) pour mémoriser votre préférence de langue (FR/EN) et votre session administrateur. Aucun cookie de traçage publicitaire n'est installé.",
    "terms.s6.title": "Responsabilité",
    "terms.s6.body":
      "Attouna Services met tout en œuvre pour assurer l'exactitude des informations publiées. Cependant, l'agence ne saurait être tenue responsable d'erreurs, d'omissions ou d'interruptions temporaires du service. L'utilisateur reste seul responsable de l'usage qu'il fait des informations du site.",
    "terms.s7.title": "Permis CNESST",
    "terms.s7.body":
      "Attouna Services est une agence de placement de personnel détentrice du permis CNESST numéro AP-2604802, conformément à la Loi sur les normes du travail du Québec. Ce permis garantit la conformité légale de nos pratiques de recrutement et de placement.",
    "terms.s8.title": "Droit applicable",
    "terms.s8.body":
      "Les présentes conditions sont régies par le droit québécois. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des tribunaux de Montréal.",
    "terms.contact.title": "Besoin d'information supplémentaire ?",
  },

  en: {
    "nav.home": "Home",
    "nav.jobs": "Job offers",
    "nav.employers": "For employers",
    "nav.blog": "Blog",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.admin": "Sign in",
    "nav.apply": "Apply",

    "brand.tagline": "Staffing agency · Montreal",

    "hero.kicker": "Staffing agency · Montreal",
    "hero.title.1": "Reliable talent,",
    "hero.title.2": "for teams that perform.",
    "hero.subtitle":
      "Attouna Services helps Quebec companies recruit in warehousing, landscaping and hospitality. Your talent, our priority.",
    "hero.cta.jobs": "View job offers",
    "hero.cta.spontaneous": "Open application",
    "hero.stat.years": "Years of expertise",
    "hero.stat.sectors": "Sectors served",
    "hero.stat.placed": "Candidates placed",

    "about.kicker": "About",
    "about.title": "A human-sized staffing agency, devoted to your success.",
    "about.text":
      "Based in Montreal, Attouna Services specializes in placing qualified personnel in warehousing, landscaping and hospitality. We combine rigor, transparency and commitment to build lasting relationships with our clients and candidates.",
    "about.feat.1.t": "Targeted recruitment",
    "about.feat.1.d": "Profiles selected for your operational needs.",
    "about.feat.2.t": "CNESST compliant",
    "about.feat.2.d": "Agency holder of permit AP-2604802.",
    "about.feat.3.t": "Continuous support",
    "about.feat.3.d": "A dedicated contact at every step.",
    "about.feat.4.t": "Responsiveness",
    "about.feat.4.d": "Fast placement, within agreed timelines.",

    "sectors.kicker": "Our sectors",
    "sectors.title": "Three areas of expertise",
    "sectors.subtitle": "Deep knowledge of each sector for a successful placement.",
    "sectors.entrepot.label": "Warehouse work",
    "sectors.entrepot.short": "Warehouse",
    "sectors.entrepot.desc": "Forklift operators, handlers, order picking, packaging and shipping.",
    "sectors.paysagerie.label": "Outdoor maintenance / Landscaping",
    "sectors.paysagerie.short": "Landscaping",
    "sectors.paysagerie.desc": "Mowing, trimming, landscape design, snow removal and seasonal upkeep.",
    "sectors.hotelier.label": "Hotel services",
    "sectors.hotelier.short": "Hospitality",
    "sectors.hotelier.desc": "Room attendants, housekeeping, front desk and dining service.",
    "sectors.viewOffers": "View offers",

    "contact.kicker": "Contact us",
    "contact.title": "Let's talk about your hiring needs.",
    "contact.subtitle":
      "Whether you're an employer or a candidate, our team is here to build what's next together.",
    "contact.callNow": "Call now",
    "contact.viewJobs": "Browse jobs",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.address": "Address",

    "footer.about":
      "Staffing agency. We connect talent and employers with rigor and dedication.",
    "footer.coords": "Contact info",
    "footer.nav": "Navigation",
    "footer.compliance": "Compliance",
    "footer.permit": "CNESST permit",
    "footer.permitSub": "Personnel placement agency",
    "footer.rights": "All rights reserved.",
    "footer.compliant": "Site compliant with Quebec CNESST standards.",

    "jobs.kicker": "Job offers",
    "jobs.title.1": "Find the job",
    "jobs.title.2": "that fits you.",
    "jobs.subtitle": "Browse open positions across three key sectors. Apply in a few clicks with your CV.",
    "jobs.filter.all": "All sectors",
    "jobs.loading": "Loading offers...",
    "jobs.count.singular": "position open",
    "jobs.count.plural": "positions open",
    "jobs.empty": "No active offers right now. You can still send an open application.",
    "jobs.spontaneous": "Open application",
    "jobs.apply": "Apply",

    "form.application.title": "Open application",
    "form.application.titleJob": "Apply for:",
    "form.application.subtitle": "Fill in this form and attach your CV as PDF.",
    "form.firstName": "First name",
    "form.lastName": "Last name",
    "form.email": "Email",
    "form.phone": "Phone",
    "form.sector": "Target sector",
    "form.sector.choose": "Choose a sector",
    "form.coverLetter": "Cover letter",
    "form.coverLetter.placeholder": "Introduce yourself in a few lines...",
    "form.cv": "CV (PDF, max 10 MB)",
    "form.cv.hint": "Click to upload your CV",
    "form.cancel": "Cancel",
    "form.submit": "Send my application",
    "form.success.title": "Application sent!",
    "form.success.text":
      "Thank you. Our team will review your application and get back to you shortly.",
    "form.close": "Close",
    "form.error.pdf": "CV must be a PDF file.",
    "form.error.size": "CV must not exceed 10 MB.",
    "form.error.cv": "Please attach your CV as PDF.",
    "form.error.sector": "Please select a sector.",
    "form.error.submit": "Submission failed.",
    "form.success.toast": "Application sent!",

    "employers.kicker": "For employers",
    "employers.title.1": "Find the right talent,",
    "employers.title.2": "fast and hassle-free.",
    "employers.subtitle":
      "Looking for reliable staff? Tell us your needs and we'll propose qualified candidates.",
    "employers.cta": "Request staff",
    "employers.why.kicker": "Why us",
    "employers.why.title": "A trusted recruitment partner.",
    "employers.why.1.t": "Pre-screened candidates",
    "employers.why.1.d": "Verified profiles tailored to your industry.",
    "employers.why.2.t": "Express turnaround",
    "employers.why.2.d": "Reply within 24-48 hours, fast placement.",
    "employers.why.3.t": "CNESST compliant",
    "employers.why.3.d": "Agency holder of permit AP-2604802.",
    "employers.why.4.t": "Single point of contact",
    "employers.why.4.d": "One contact from brief to placement.",
    "employers.process.kicker": "Our process",
    "employers.process.title": "How it works",
    "employers.process.1.t": "Tell us your needs",
    "employers.process.1.d": "Roles, target profiles, timelines, constraints.",
    "employers.process.2.t": "We identify the talent",
    "employers.process.2.d": "Sourcing, interviews, checks.",
    "employers.process.3.t": "You hire with confidence",
    "employers.process.3.d": "Candidate presentation, placement follow-up.",
    "employers.form.title": "Staff request",
    "employers.form.subtitle": "Fill this form — we'll get back to you within 48 hours.",
    "employers.form.company": "Company name",
    "employers.form.contact": "Contact person",
    "employers.form.email": "Business email",
    "employers.form.phone": "Phone",
    "employers.form.sector": "Sector",
    "employers.form.sectorOther": "Other",
    "employers.form.nbPositions": "Number of positions",
    "employers.form.urgency": "Urgency",
    "employers.form.urgency.immediate": "Immediate",
    "employers.form.urgency.1-2_semaines": "1 to 2 weeks",
    "employers.form.urgency.1_mois": "Within 1 month",
    "employers.form.urgency.flexible": "Flexible",
    "employers.form.description": "Need description",
    "employers.form.description.placeholder":
      "Tasks, schedule, specific requirements, contract length...",
    "employers.form.submit": "Send my request",
    "employers.form.success.title": "Request sent!",
    "employers.form.success.text":
      "Thank you. Our team will contact you within 48 hours to discuss your needs.",
    "employers.form.error.submit": "Failed to send request.",

    "admin.welcome": "Welcome",
    "admin.subtitle": "Manage job offers, applications and employer requests.",
    "admin.tab.jobs": "Job offers",
    "admin.tab.applications": "Applications",
    "admin.tab.employers": "Employer requests",
    "admin.logout": "Sign out",

    "common.required": "*",
    "common.fr": "FR",
    "common.en": "EN",

    "blog.kicker": "Blog & insights",
    "blog.title.1": "Insights and advice",
    "blog.title.2": "to hire smarter.",
    "blog.subtitle":
      "Our analyses, best practices and trends from Quebec's job market.",
    "blog.read": "Read article",
    "blog.back": "Back to blog",

    "terms.kicker": "Legal",
    "terms.title": "Terms of use",
    "terms.lastUpdated": "Last updated",
    "terms.intro":
      "By accessing this site, you accept these terms of use. They cover your browsing, the use of the application and employer request forms, and the processing of your personal data by Attouna Services.",
    "terms.s1.title": "Purpose of the site",
    "terms.s1.body":
      "The attounaservice.ca site presents Attouna Services's staffing services, publishes job offers and lets candidates and employers contact the agency. Information is provided for indicative purposes.",
    "terms.s2.title": "Personal data collection and use",
    "terms.s2.body":
      "Data submitted via the forms (application or employer request) is used solely by Attouna Services to handle your request. It is not sold or shared with third parties. CVs are stored securely and kept for up to 24 months unless deleted earlier upon request.",
    "terms.s3.title": "Right to access, correct and delete",
    "terms.s3.body":
      "Under Quebec's privacy laws, you have the right to access, correct and delete your personal data. To exercise this right, write to info@attounaservice.ca specifying the purpose of your request.",
    "terms.s4.title": "Intellectual property",
    "terms.s4.body":
      "All site content (logos, text, graphics, images) is the property of Attouna Services or its partners. Any reproduction, distribution or adaptation without prior written permission is prohibited.",
    "terms.s5.title": "Cookies and analytics",
    "terms.s5.body":
      "The site uses local storage (localStorage) to remember your language preference (FR/EN) and your admin session. No advertising tracking cookies are installed.",
    "terms.s6.title": "Liability",
    "terms.s6.body":
      "Attouna Services does its best to ensure information accuracy. However, the agency cannot be held liable for errors, omissions or temporary service interruptions. Users remain solely responsible for how they use the information on the site.",
    "terms.s7.title": "CNESST permit",
    "terms.s7.body":
      "Attouna Services is a staffing agency holding CNESST permit number AP-2604802, in accordance with Quebec's Labour Standards Act. This permit guarantees legal compliance of our recruitment and placement practices.",
    "terms.s8.title": "Applicable law",
    "terms.s8.body":
      "These terms are governed by Quebec law. Any dispute related to their interpretation or execution falls under the exclusive jurisdiction of the courts of Montreal.",
    "terms.contact.title": "Need more information?",
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return saved === "en" ? "en" : "fr";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key) => (dict[lang] && dict[lang][key]) || dict.fr[key] || key,
    [lang]
  );
  const toggle = useCallback(() => setLang((l) => (l === "fr" ? "en" : "fr")), []);

  const value = useMemo(
    () => ({ lang, setLang, toggle, t }),
    [lang, toggle, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx;
}
