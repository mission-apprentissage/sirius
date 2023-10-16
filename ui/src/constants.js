export const USER_ROLES = {
  ADMIN: "ADMIN",
  ETABLISSEMENT: "ETABLISSEMENT",
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
};

export const DIPLOME_TYPE_MATCHER = {
  "CERTIFICAT D'APTITUDES PROFESSIONNELLES": "Certificat d’Aptitude Professionnelle",
  "MENTION COMPLEMENTAIRE": "Mention Complémentaire",
  "BREVET PROFESSIONNEL": "Brevet Professionnel",
  "BAC PROFESSIONNEL": "Bac Professionnel",
  "TH DE NIV 5 DES CHAMBRES DE METIERS": "Titre Homologué de Niveau 5 des Chambres de Métiers",
  "TH DE NIV 4 DES CHAMBRES DE METIERS": "Titre Homologué de Niveau 4 des Chambres de Métiers",
  "TH DE NIV 4 ORGANISMES GESTIONNAIRES DIVERS":
    "Titre Homologué de Niveau 4 Organismes Gestionnaires Divers",
};

export const emailWithTLDRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
