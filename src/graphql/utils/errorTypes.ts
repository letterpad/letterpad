export class UnAuthorized extends Error {
  statusCode = 401;
  constructor({ statusCode = 401, error }) {
    super(error);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  constructor({ statusCode = 404 }) {
    super("Page not found");
    this.statusCode = statusCode;
  }
}
