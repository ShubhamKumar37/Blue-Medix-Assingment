class ResponseHandler {
    constructor(statusCode, message = "This is the response", data) {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data ? data : null;
    }
}

export { ResponseHandler };