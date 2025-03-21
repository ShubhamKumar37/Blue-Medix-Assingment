class ErrorHandler extends Error {
    constructor(statusCode, message = "There is a problem (check ErrorHandler.util.js)", errors = [], stack = "") {
        super(message);
        this.success = statusCode;
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;

        if (stack) this.stack = stack;
        else Error.captureStackTrace(this, this.constructor);

    }
}

export { ErrorHandler };