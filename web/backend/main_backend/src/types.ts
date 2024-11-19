export type ErrorResponse = {
    error: string;
}

export type BaseResponse<T> = T | ErrorResponse