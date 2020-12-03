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

const Errors = {
  QuestionnaireNotFoundError: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || "Questionnaire inconnu", extra);
    }

    get status() {
      return 404;
    }
  },
  QuestionnaireNotAvailableError: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || "Désolé le questionnaire n'est plus disponible", extra);
    }

    get status() {
      return 400;
    }
  },
};

module.exports = Errors;
