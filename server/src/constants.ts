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

export const DIPLOME_TYPE_MATCHER = {
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

export const ETABLISSEMENT_NATURE = {
  GESTIONNAIRE_FORMATEUR: "responsable_formateur",
  GESTIONNAIRE: "responsable",
  FORMATEUR: "formateur",
};

export const ETABLISSEMENT_RELATION_TYPE = {
  RESPONSABLE_FORMATEUR: "responsable->formateur",
  FORMATEUR_RESPONSABLE: "formateur->responsable",
};

export const VERBATIM_STATUS = {
  PENDING: "PENDING",
  VALIDATED: "VALIDATED",
  TO_FIX: "TO_FIX",
  ALERT: "ALERT",
  REJECTED: "REJECTED",
  GEM: "GEM",
};

export const VERBATIM_STATUS_EMOJIS = {
  PENDING: ":hourglass_flowing_sand:",
  VALIDATED: ":white_check_mark:",
  TO_FIX: ":wrench:",
  ALERT: ":rotating_light:",
  REJECTED: ":x:",
  GEM: ":gem:",
};

export const VERBATIM_STATUS_LABELS = {
  [VERBATIM_STATUS.PENDING]: "En attente",
  [VERBATIM_STATUS.VALIDATED]: "Validé",
  [VERBATIM_STATUS.TO_FIX]: "À corriger",
  [VERBATIM_STATUS.ALERT]: "Alerte",
  [VERBATIM_STATUS.REJECTED]: "Rejeté",
  [VERBATIM_STATUS.GEM]: "Pépite",
};

export const UNCOMPLIANT_TEMOIGNAGE_TYPE = {
  ALL: "all",
  BOT: "bot",
  INCOMPLETE: "incomplete",
  QUICK: "quick",
};

export const VERBATIM_THEMES = {
  INTEGRATION_AMBIANCE: "INTEGRATION_AMBIANCE",
  APPRENTISSAGE_METIER: "APPRENTISSAGE_METIER",
  HORAIRES: "HORAIRES",
  RYTHME_ENTREPRISE_ETABLISSEMENT: "RYTHME_ENTREPRISE_ETABLISSEMENT",
  MOINS_VACANCES: "MOINS_VACANCES",
  JOURNEE_TYPE_ENTREPRISE: "JOURNEE_TYPE_ENTREPRISE",
  AMBIANCE_ETABLISSEMENT: "AMBIANCE_ETABLISSEMENT",
  DIFFICULTES_COURS: "DIFFICULTES_COURS",
  ENSEIGNEMENT_PROPOSE: "ENSEIGNEMENT_PROPOSE",
  EQUIPEMENTS: "EQUIPEMENTS",
  ACCESSIBILITE_HANDICAP: "ACCESSIBILITE_HANDICAP",
  CHARGE_TRAVAIL: "CHARGE_TRAVAIL",
  JOURNEE_TYPE_ETABLISSEMENT: "JOURNEE_TYPE_ETABLISSEMENT",
  RYTHME_PERSONNEL_ETABLISSEMENT: "RYTHME_PERSONNEL_ETABLISSEMENT",
};

export const VERBATIM_THEMES_EMOJIS = {
  [VERBATIM_THEMES.INTEGRATION_AMBIANCE]: ":star2:",
  [VERBATIM_THEMES.APPRENTISSAGE_METIER]: ":books:",
  [VERBATIM_THEMES.HORAIRES]: ":clock3:",
  [VERBATIM_THEMES.RYTHME_ENTREPRISE_ETABLISSEMENT]: ":balance_de_la_justice:",
  [VERBATIM_THEMES.MOINS_VACANCES]: ":desert_island:",
  [VERBATIM_THEMES.JOURNEE_TYPE_ENTREPRISE]: ":office:",
  [VERBATIM_THEMES.AMBIANCE_ETABLISSEMENT]: ":school:",
  [VERBATIM_THEMES.DIFFICULTES_COURS]: ":book:",
  [VERBATIM_THEMES.ENSEIGNEMENT_PROPOSE]: ":blue_book:",
  [VERBATIM_THEMES.EQUIPEMENTS]: ":hammer_and_wrench:",
  [VERBATIM_THEMES.ACCESSIBILITE_HANDICAP]: ":wheelchair:",
  [VERBATIM_THEMES.CHARGE_TRAVAIL]: ":briefcase:",
  [VERBATIM_THEMES.JOURNEE_TYPE_ETABLISSEMENT]: ":school:",
  [VERBATIM_THEMES.RYTHME_PERSONNEL_ETABLISSEMENT]: ":runner:",
};

export const VERBATIM_THEMES_LABELS = {
  [VERBATIM_THEMES.INTEGRATION_AMBIANCE]: "Intégration et ambiance",
  [VERBATIM_THEMES.APPRENTISSAGE_METIER]: "Apprentissage du métier",
  [VERBATIM_THEMES.HORAIRES]: "Horaires",
  [VERBATIM_THEMES.RYTHME_ENTREPRISE_ETABLISSEMENT]: "Rythme entreprise - établissement scolaire",
  [VERBATIM_THEMES.MOINS_VACANCES]: "Avoir moins de vacances",
  [VERBATIM_THEMES.JOURNEE_TYPE_ENTREPRISE]: "Journée-type en entreprise",
  [VERBATIM_THEMES.AMBIANCE_ETABLISSEMENT]: "Ambiance établissement",
  [VERBATIM_THEMES.DIFFICULTES_COURS]: "Difficulté des cours",
  [VERBATIM_THEMES.ENSEIGNEMENT_PROPOSE]: "Enseignement proposé par établissement",
  [VERBATIM_THEMES.EQUIPEMENTS]: "Equipements mis à disposition",
  [VERBATIM_THEMES.ACCESSIBILITE_HANDICAP]: "Accessibilité pour les personnes en situation de handicap",
  [VERBATIM_THEMES.CHARGE_TRAVAIL]: "Charge de travail",
  [VERBATIM_THEMES.JOURNEE_TYPE_ETABLISSEMENT]: "Journée-type en établissement",
  [VERBATIM_THEMES.RYTHME_PERSONNEL_ETABLISSEMENT]: "Rythme personnel - établissement scolaire",
};

export const ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES = {
  "<strong>Ton intégration et l’ambiance</strong> dans ton entreprise": VERBATIM_THEMES.INTEGRATION_AMBIANCE,
  "<strong>Le rythme</strong> entreprise <-> école": VERBATIM_THEMES.RYTHME_ENTREPRISE_ETABLISSEMENT,
  "<strong>Ce que tu apprends de ce métier</strong> dans ton entreprise": VERBATIM_THEMES.APPRENTISSAGE_METIER,
  "<strong>Les horaires</strong> en entreprise": VERBATIM_THEMES.HORAIRES,
  "D’avoir moins de <strong>vacances</strong>": VERBATIM_THEMES.MOINS_VACANCES,
};

export const ANSWER_LABELS_TO_ETABLISSEMENT_VERBATIM_THEMES = {
  "<strong>L'ambiance</strong>": VERBATIM_THEMES.AMBIANCE_ETABLISSEMENT,
  "<strong>Le niveau de difficulté des cours</strong>": VERBATIM_THEMES.DIFFICULTES_COURS,
  "<strong>L’enseignement</strong> proposé par le CFA": VERBATIM_THEMES.ENSEIGNEMENT_PROPOSE,
  "<strong>Les équipements</strong> mis à ta disposition au CFA": VERBATIM_THEMES.EQUIPEMENTS,
  "<strong>L’accessibilité du CFA</strong> pour les personnes en situation de handicap":
    VERBATIM_THEMES.ACCESSIBILITE_HANDICAP,
  "<strong>La charge de travail</strong>": VERBATIM_THEMES.CHARGE_TRAVAIL,
};

export const OBSERVER_SCOPES = {
  NUM_DEPARTEMENT: "num_departement",
  REGION: "region",
  SIRETS: "sirets",
  NATIONAL: "national",
  OPCO: "opco",
};
