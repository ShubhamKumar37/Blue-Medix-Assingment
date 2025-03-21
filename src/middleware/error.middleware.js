import { ErrorHandler } from "../util/index.js";

const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (!(err instanceof ErrorHandler)) {
        statusCode = 500;
        message = "Something went wrong!";
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        data: null,
        errors: err.errors || []
    });
};

export { errorMiddleware };
