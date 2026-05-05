export const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_talent-attouna/artifacts/8zwewl64_image.png";

export const BRAND = {
  name: "Attouna Service",
  slogan: "Votre talent, notre priorité",
  phone: "514-232-4251",
  email: "attounaservice@yahoo.com",
  address: "9950 Place de l'Acadie, Montréal, Qc",
  cnesst: "AP-2604802",
};

export const SECTORS = [
  {
    key: "entrepot",
    label: "Travail en entrepôt",
    short: "Entrepôt",
    icon: "Warehouse",
    description:
      "Cariste, manutentionnaire, préparation de commandes, emballage et expédition.",
    image:
      "https://images.unsplash.com/photo-1687203920859-c87cb0955630?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80",
  },
  {
    key: "paysagerie",
    label: "Entretien extérieur / Paysagerie",
    short: "Paysagerie",
    icon: "Trees",
    description:
      "Tonte, taille, aménagement paysager, déneigement et entretien saisonnier.",
    image:
      "https://images.unsplash.com/photo-1627740283098-1c544d3a479d?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80",
  },
  {
    key: "hotelier",
    label: "Service hôtelier",
    short: "Hôtelier",
    icon: "BedDouble",
    description:
      "Préposé·e aux chambres, entretien ménager, accueil et service en salle.",
    image:
      "https://images.unsplash.com/photo-1621891336682-341097be99cd?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80",
  },
];

export const SECTOR_MAP = SECTORS.reduce((acc, s) => {
  acc[s.key] = s;
  return acc;
}, {});
