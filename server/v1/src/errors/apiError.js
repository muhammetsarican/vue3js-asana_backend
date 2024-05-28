class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
    }

    notFound() {
        this.status = 404;
        this.message = "No record found like that!"
    }
}

module.exports = ApiError;