export class BasicError extends Error {
  constructor(message?: any, extra?: any) {
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
  FormationNotFoundError: "Formation inconnue",
  EtablissementAlreadyExistingError: "Etablissement déjà existant",
  FormationAlreadyExistingError: "Formation déjà existante",
  UserAlreadyExistsError: "Un utilisateur avec cet email existe déjà",
  UserNotFound: "Utilisateur inconnu",
  UnconfirmedEmail: "Email non confirmé",
  SortingTypeNotFound: "Ce type de tri n'existe pas.",
};

export const CampagneNotFoundError = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.CampagneNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const TemoignageNotFoundError = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.TemoignageNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const QuestionnaireNotFoundError = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.QuestionnaireNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const UnauthorizedError = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.UnauthorizedError, extra);
  }

  get status() {
    return 401;
  }
};
export const CampagneNotStarted = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.CampagneNotStarted, extra);
  }

  get status() {
    return 403;
  }
};
export const CampagneEnded = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.CampagneEnded, extra);
  }

  get status() {
    return 403;
  }
};
export const NoSeatsAvailable = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.NoSeatsAvailable, extra);
  }

  get status() {
    return 403;
  }
};
export const EtablissementNotFoundError = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.EtablissementNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const FormationNotFoundError = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.FormationNotFoundError, extra);
  }

  get status() {
    return 404;
  }
};
export const EtablissementAlreadyExistingError = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.EtablissementAlreadyExistingError, extra);
  }

  get status() {
    return 400;
  }
};
export const FormationAlreadyExistingError = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.FormationAlreadyExistingError, extra);
  }

  get status() {
    return 400;
  }
};
export const UserAlreadyExistsError = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.UserAlreadyExistsError, extra);
  }

  get status() {
    return 400;
  }
};
export const UserNotFound = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.UserNotFound, extra);
  }

  get status() {
    return 404;
  }
};
export const UnconfirmedEmail = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.UnconfirmedEmail, extra);
  }

  get status() {
    return 403;
  }
};
export const SortingTypeNotFoundError = class NotFoundError extends BasicError {
  constructor(message?: any, extra?: any) {
    super(message || ErrorMessage.SortingTypeNotFound, extra);
  }

  get status() {
    return 400;
  }
};
