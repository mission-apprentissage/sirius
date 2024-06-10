export const USER_ROLES = {
  ADMIN: "ADMIN",
  ETABLISSEMENT: "ETABLISSEMENT",
  OBSERVER: "OBSERVER",
};

export const USER_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const VERBATIM_STATUS = {
  PENDING: "PENDING",
  VALIDATED: "VALIDATED",
  TO_FIX: "TO_FIX",
  ALERT: "ALERT",
  REJECTED: "REJECTED",
  GEM: "GEM",
};

export const VERBATIM_STATUS_LABELS = {
  [VERBATIM_STATUS.PENDING]: "En attente",
  [VERBATIM_STATUS.VALIDATED]: "Validé",
  [VERBATIM_STATUS.TO_FIX]: "À corriger",
  [VERBATIM_STATUS.ALERT]: "Alerte",
  [VERBATIM_STATUS.REJECTED]: "Rejeté",
  [VERBATIM_STATUS.GEM]: "Pépite",
};

export const DIPLOME_TYPE_MATCHER = {
  "CERTIFICAT D'APTITUDES PROFESSIONNELLES": "Certificat d’Aptitudes Professionnelles",
  "CERTIFICAT D'APTITUDE PROFESSIONNELLE": "Certificat d’Aptitude Professionnelle",
  "MENTION COMPLEMENTAIRE": "Mention Complémentaire",
  "BREVET PROFESSIONNEL": "Brevet Professionnel",
  "BAC PROFESSIONNEL": "Bac Professionnel",
  "TH DE NIV 5 DES CHAMBRES DE METIERS": "Titre Homologué de Niveau 5 des Chambres de Métiers",
  "TH DE NIV 4 DES CHAMBRES DE METIERS": "Titre Homologué de Niveau 4 des Chambres de Métiers",
  "TH DE NIV 4 ORGANISMES GESTIONNAIRES DIVERS":
    "Titre Homologué de Niveau 4 Organismes Gestionnaires Divers",
  "TH DE NIV 4 MINISTERE DU TRAVAIL - AFPA":
    "Titre Homologué de Niveau 4 Ministère du Travail - AFPA",
  "TH DE NIV 5 MINISTERE DU TRAVAIL - AFPA":
    "Titre Homologué de Niveau 5 Ministère du Travail - AFPA",
  "AUTRES DIPLOMES DE NIVEAU IV": "Autres Diplômes de Niveau 4",
  "AUTRES DIPLOMES DE NIVEAU V": "Autres Diplômes de Niveau 5",
  "BAC PROFESSIONNEL AGRICOLE": "Bac Professionnel Agricole",
  "BAC TECHNOLOGIQUE AGRICOLE": "Bac Technologique Agricole",
  "BREVET D'ETUDES PROFESSIONNELLES AGRICOLES": "Brevet d'Études Professionnelles Agricoles",
  "BREVET DE TECHNICIEN": "Brevet de Technicien",
  "BREVET DES METIERS D'ART - BREVET DES METIERS DU SPECTACLE":
    "Brevet des Métiers d'Art - Brevet des Métiers du Spectacle",
  "BREVET PROFESSIONNEL AGRICOLE DE NIVEAU IV": "Brevet Professionnel Agricole de Niveau 4",
  "BREVET PROFESSIONNEL AGRICOLE DE NIVEAU V": "Brevet Professionnel Agricole de Niveau 5",
  "BREVET PROFESSIONNEL DE LA JEUNESSE, DE L'EDUCATION POPULAIRE ET DU SPORT":
    "Brevet Professionnel de la Jeunesse, de l'Éducation Populaire et du Sport",
  "CERTIFICAT D'APTITUDES PROFESSIONNELLES AGRICOLES":
    "Certificat d’Aptitudes Professionnelles Agricoles",
  "CERTIFICAT DE SPECIALISATION AGRICOLE DE NIVEAU 4":
    "Certificat de Spécialisation Agricole de Niveau 4",
  "CERTIFICAT DE SPECIALISATION AGRICOLE DE NIVEAU 5":
    "Certificat de Spécialisation Agricole de Niveau 5",
  "TH DE NIV 4 DES CCI ET MINISTERE COMMERCE ARTISANAT PME":
    "Titre Homologué de Niveau 4 des CCI et Ministère Commerce Artisanat PME",
  "TH DE NIV 4 DES ORGANISMES ET CHAMBRES D'AGRICULTURE":
    "Titre Homologué de Niveau 4 des Organismes et Chambres d'Agriculture",
  "TH DE NIV 4 EDUCATION RECTORAT GRETA ...":
    "Titre Homologué de Niveau 4 Éducation Rectorat GRETA ...",
  "TH DE NIV 4 INSTANCES REGIONALES": "Titre Homologué de Niveau 4 Instances Régionales",
  "TH DE NIV 4 MINISTERE INDUSTRIE": "Titre Homologué de Niveau 4 Ministère Industrie",
  "TH DE NIV 4 REMONTES DES CFA AGRICOLES":
    "Titre Homologué de Niveau 4 Remontées des CFA Agricoles",
  "TH DE NIV 4 SANTE SOCIAL": "Titre Homologué de Niveau 4 Santé Social",
  "TH DE NIV 5 DES CCI ET MINISTERE COMMERCE ARTISANAT PME":
    "Titre Homologué de Niveau 5 des CCI et Ministère Commerce Artisanat PME",
  "TH DE NIV 5 EDUCATION RECTORAT GRETA ...":
    "Titre Homologué de Niveau 5 Éducation Rectorat GRETA ...",
  "TH DE NIV 5 INSTANCES REGIONALES": "Titre Homologué de Niveau 5 Instances Régionales",
  "TH DE NIV 5 MINISTERE DE LA JEUNESSE ET DES SPORTS":
    "Titre Homologué de Niveau 5 Ministère de la Jeunesse et des Sports",
  "TH DE NIV 5 ORGANISMES GESTIONNAIRES DIVERS":
    "Titre Homologué de Niveau 5 Organismes Gestionnaires Divers",
};

export const emailWithTLDRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const numberRegex = /^\d+$/;

export const campagnesDisplayMode = [
  {
    label: "Niveau de diplôme",
    value: "DIPLOME_TYPE",
  },
  {
    label: "Établissement",
    value: "ETABLISSEMENT",
  },
  {
    label: "Toutes",
    value: "ALL",
  },
];

export const campagnesSortingOptions = [
  { label: "Formation (A-Z)", value: "formation-asc" },
  { label: "Formation (Z-A)", value: "formation-desc" },
  { label: "Nom d'usage formation (A-Z)", value: "nomCampagne-asc" },
  { label: "Nom d'usage formation (Z-A)", value: "nomCampagne-desc" },
  { label: "Début campagne (Ancienne-Récente)", value: "startDate-asc" },
  { label: "Début campagne (Récente-Ancienne)", value: "startDate-desc" },
  { label: "Fin campagne (Ancienne-Récente)", value: "endDate-asc" },
  { label: "Fin campagne (Récente-Ancienne)", value: "endDate-desc" },
  { label: "Apprenti·es (0-1)", value: "seats-asc" },
  { label: "Apprenti·es (1-0)", value: "seats-desc" },
];

export const ROLE_TYPE = {
  ETABLISSEMENT: "ETABLISSEMENT",
  OBSERVER: "OBSERVER",
};

export const OBSERVER_SCOPES = {
  NUM_DEPARTEMENT: "num_departement",
  REGION: "region",
  SIRETS: "sirets",
};

export const OBSERVER_SCOPES_LABELS = {
  [OBSERVER_SCOPES.NUM_DEPARTEMENT]: "Numéro de département",
  [OBSERVER_SCOPES.REGION]: "Nom de la région",
  [OBSERVER_SCOPES.SIRETS]: "Liste de SIRET",
};

export const CAMPAGNE_TABLE_TYPES = {
  MANAGE: "MANAGE",
  RESULTS: "RESULTS",
  CREATE: "CREATE",
};

export const firstNameList = [
  "Sélim",
  "Myriam",
  "Anaïs",
  "Marjorie",
  "Pierre",
  "Do",
  "Benjamin",
  "Yohann",
  "Julianne",
  "Titouan",
  "Kylian",
  "Mehdi",
  "Anissa",
  "Paloma",
  "Patxi",
  "Léonie",
  "Valentine",
  "Juliette",
  "Lucilien",
  "Mohammed",
  "Quentin",
  "Yanis",
  "Océane",
  "Jérémy",
  "Rima",
  "Pedro",
  "Lorenzo",
  "Noah",
  "Jade",
  "Adam",
  "Lou",
  "Emma",
  "Simon",
  "Fañch",
  "Issam",
  "Risvan",
  "Wejdene",
];
