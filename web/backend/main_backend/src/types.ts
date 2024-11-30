export type ErrorResponse = {
    error: string;
}

export type BaseResponse<T> = T | ErrorResponse

export type CustomResponse<T> = T | {errMsg: string}