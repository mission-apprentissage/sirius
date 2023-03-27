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
  CampagneNotFoundError: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || "Campagne inconnue", extra);
    }

    get status() {
      return 404;
    }
  },
  TemoignageNotFoundError: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || "Temoignage inconnu", extra);
    }

    get status() {
      return 404;
    }
  },
  UnauthorizedError: class NotFoundError extends BasicError {
    constructor(message, extra) {
      super(message || "Unauthorized", extra);
    }

    get status() {
      return 401;
    }
  },
};

module.exports = { ...Errors, BasicError };
