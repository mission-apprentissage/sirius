export class BasicError extends Error {
  constructor(message?: string, extra?: unknown) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || "Error";
    if (extra) {
      // @ts-ignore
      this.extra = extra;
    }
  }

  get status() {
    return 500;
  }
}

export const ErrorMessage = {
  CampagneNotFoundError: "Campagne inconnue",
  TemoignageNotFoundError: "Temoignage inconnu",
  QuestionnaireNotFoundError: "Questionnaire inconnu",
  UnauthorizedError: "Unauthorized",
  CampagneNotStarted: "La campagne n'a pas encore commencé",
  CampagneEnded: "La campagne est terminée",
  NoSeatsAvailable: "La campagne n'a plus de places disponibles",
  EtablissementNotFoundError: "Etablissement inconnu",
  EtablissementAlreadyExistingError: "Etablissement déjà existant",
  UserAlreadyExistsError: "Un utilisateur avec cet email existe déjà",
  UserNotFound: "Utilisateur inconnu",
  UnconfirmedEmail: "Email non confirmé",
  FormationNotFoundError: "Formation inconnue",
  JobNotFoundError: "Job inconnu",
  TemoignageCreationError: "Erreur lors de la création du témoignage",
};

export const CampagneNotFoundError = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.CampagneNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const TemoignageNotFoundError = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.TemoignageNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const QuestionnaireNotFoundError = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.QuestionnaireNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const UnauthorizedError = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.UnauthorizedError, extra);
  }

  get status() {
    return 401;
  }
};
export const CampagneNotStarted = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.CampagneNotStarted, extra);
  }

  get status() {
    return 403;
  }
};
export const CampagneEnded = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.CampagneEnded, extra);
  }

  get status() {
    return 403;
  }
};
export const NoSeatsAvailable = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.NoSeatsAvailable, extra);
  }

  get status() {
    return 403;
  }
};
export const EtablissementNotFoundError = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.EtablissementNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const EtablissementAlreadyExistingError = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.EtablissementAlreadyExistingError, extra);
  }

  get status() {
    return 400;
  }
};

export const UserAlreadyExistsError = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.UserAlreadyExistsError, extra);
  }

  get status() {
    return 400;
  }
};
export const UserNotFound = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.UserNotFound, extra);
  }

  get status() {
    return 404;
  }
};
export const UnconfirmedEmail = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.UnconfirmedEmail, extra);
  }

  get status() {
    return 403;
  }
};
export const FormationNotFound = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.FormationNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const JobNotFound = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.JobNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const TemoignageCreationError = class NotFoundError extends BasicError {
  constructor(message?: string, extra?: unknown) {
    super(message || ErrorMessage.TemoignageCreationError, extra);
  }

  get status() {
    return 403;
  }
};
