const USER_ROLES = {
  ADMIN: "ADMIN",
  ETABLISSEMENT: "ETABLISSEMENT",
};

const USER_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

const DIPLOME_TYPE_MATCHER = {
  "CERTIFICAT D'APTITUDES PROFESSIONNELLES": "Certificat d’Aptitude Professionnelle",
  "MENTION COMPLEMENTAIRE": "Mention Complémentaire",
  "BREVET PROFESSIONNEL": "Brevet Professionnel",
  "BAC PROFESSIONNEL": "Bac Professionnel",
  "TH DE NIV 5 DES CHAMBRES DE METIERS": "Titre Homologué de Niveau 5 des Chambres de Métiers",
  "TH DE NIV 4 DES CHAMBRES DE METIERS": "Titre Homologué de Niveau 4 des Chambres de Métiers",
  "TH DE NIV 4 ORGANISMES GESTIONNAIRES DIVERS": "Titre Homologué de Niveau 4 Organismes Gestionnaires Divers",
  "TH DE NIV 4 MINISTERE DU TRAVAIL - AFPA": "Titre Homologué de Niveau 4 Ministère du Travail - AFPA",
  "TH DE NIV 5 MINISTERE DU TRAVAIL - AFPA": "Titre Homologué de Niveau 5 Ministère du Travail - AFPA",
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
  "CERTIFICAT D'APTITUDES PROFESSIONNELLES AGRICOLES": "Certificat d’Aptitudes Professionnelles Agricoles",
  "CERTIFICAT DE SPECIALISATION AGRICOLE DE NIVEAU 4": "Certificat de Spécialisation Agricole de Niveau 4",
  "CERTIFICAT DE SPECIALISATION AGRICOLE DE NIVEAU 5": "Certificat de Spécialisation Agricole de Niveau 5",
  "TH DE NIV 4 DES CCI ET MINISTERE COMMERCE ARTISANAT PME":
    "Titre Homologué de Niveau 4 des CCI et Ministère Commerce Artisanat PME",
  "TH DE NIV 4 DES ORGANISMES ET CHAMBRES D'AGRICULTURE":
    "Titre Homologué de Niveau 4 des Organismes et Chambres d'Agriculture",
  "TH DE NIV 4 EDUCATION RECTORAT GRETA ...": "Titre Homologué de Niveau 4 Éducation Rectorat GRETA ...",
  "TH DE NIV 4 INSTANCES REGIONALES": "Titre Homologué de Niveau 4 Instances Régionales",
  "TH DE NIV 4 MINISTERE INDUSTRIE": "Titre Homologué de Niveau 4 Ministère Industrie",
  "TH DE NIV 4 REMONTES DES CFA AGRICOLES": "Titre Homologué de Niveau 4 Remontées des CFA Agricoles",
  "TH DE NIV 4 SANTE SOCIAL": "Titre Homologué de Niveau 4 Santé Social",
  "TH DE NIV 5 DES CCI ET MINISTERE COMMERCE ARTISANAT PME":
    "Titre Homologué de Niveau 5 des CCI et Ministère Commerce Artisanat PME",
  "TH DE NIV 5 EDUCATION RECTORAT GRETA ...": "Titre Homologué de Niveau 5 Éducation Rectorat GRETA ...",
  "TH DE NIV 5 INSTANCES REGIONALES": "Titre Homologué de Niveau 5 Instances Régionales",
  "TH DE NIV 5 MINISTERE DE LA JEUNESSE ET DES SPORTS":
    "Titre Homologué de Niveau 5 Ministère de la Jeunesse et des Sports",
  "TH DE NIV 5 ORGANISMES GESTIONNAIRES DIVERS": "Titre Homologué de Niveau 5 Organismes Gestionnaires Divers",
};

const ETABLISSEMENT_NATURE = {
  GESTIONNAIRE_FORMATEUR: "responsable_formateur",
  GESTIONNAIRE: "responsable",
  FORMATEUR: "formateur",
};

const ETABLISSEMENT_RELATION_TYPE = {
  RESPONSABLE_FORMATEUR: "responsable->formateur",
  FORMATEUR_RESPONSABLE: "formateur->responsable",
};

const VERBATIM_STATUS = {
  PENDING: "PENDING",
  VALIDATED: "VALIDATED",
  TO_FIX: "TO_FIX",
  ALERT: "ALERT",
  REJECTED: "REJECTED",
  GEM: "GEM",
};

module.exports = {
  USER_ROLES,
  USER_STATUS,
  DIPLOME_TYPE_MATCHER,
  ETABLISSEMENT_NATURE,
  ETABLISSEMENT_RELATION_TYPE,
  VERBATIM_STATUS,
};
