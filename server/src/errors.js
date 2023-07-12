class BasicError extends Error {
  constructor(message, extra) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || "Error";
    if (extra) {
      this.extra = extra;
    }
  }

  get status() {
    return 500;
  }
}

const ErrorMessage = {
  CampagneNotFoundError: "Campagne inconnue",
  TemoignageNotFoundError: "Temoignage inconnu",
  QuestionnaireNotFoundError: "Questionnaire inconnu",
  UnauthorizedError: "Unauthorized",
  CampagneNotStarted: "La campagne n'a pas encore commencé",
  CampagneEnded: "La campagne est terminée",
  NoSeatsAvailable: "La campagne n'a plus de places disponibles",
  EtablissementNotFoundError: "Etablissement inconnu",
};

const Errors = {
  CampagneNotFoundError: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || ErrorMessage.CampagneNotFoundError, extra);
    }

    get status() {
      return 404;
    }
  },
  TemoignageNotFoundError: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || ErrorMessage.TemoignageNotFoundError, extra);
    }

    get status() {
      return 404;
    }
  },
  QuestionnaireNotFoundError: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || ErrorMessage.QuestionnaireNotFoundError, extra);
    }

    get status() {
      return 404;
    }
  },
  UnauthorizedError: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || ErrorMessage.UnauthorizedError, extra);
    }

    get status() {
      return 401;
    }
  },
  CampagneNotStarted: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || ErrorMessage.CampagneNotStarted, extra);
    }

    get status() {
      return 403;
    }
  },
  CampagneEnded: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || ErrorMessage.CampagneEnded, extra);
    }

    get status() {
      return 403;
    }
  },
  NoSeatsAvailable: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || ErrorMessage.NoSeatsAvailable, extra);
    }

    get status() {
      return 403;
    }
  },
  EtablissementNotFoundError: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || ErrorMessage.EtablissementNotFoundError, extra);
    }

    get status() {
      return 404;
    }
  },
};

module.exports = { ...Errors, BasicError, ErrorMessage };
