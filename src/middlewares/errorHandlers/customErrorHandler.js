
class CustomError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details
        this.status = this.getStatus(statusCode);
        Error.captureStackTrace(this, this.contstructor)
    }
    getStatus(statusCode) {
        const codes = {
            200: 'ok'
            , 201: 'user created'
            , 400: 'bad Request'
            , 404: 'not Found'
            , 500: 'internal server error'
        }
        return codes[statusCode] || "some error"
    }
}
export default CustomError;