export class ApiError {
    status
    msg
    constructor(status:number, msg:string) {
        this.status = status
        this.msg = msg
    }

    static badRequest(message:string="bad Request"):ApiError{
        return new ApiError(400, message)
    }

    static notFound(message:string="Not Found"):ApiError{
        return new ApiError(404, message)
    }

    static notAuth(message:string="Not Auth"):ApiError{
        return new ApiError(401, message)
    }

    static internal(message:string):ApiError{
        return new ApiError(500, message)
    }

    static forbidden(message:string="You dont have access"):ApiError{
        return new ApiError(403, message)
    }
}

