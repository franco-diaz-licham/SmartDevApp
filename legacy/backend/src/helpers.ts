/** Maps respose to return generic response */
export function mapToResponse<T>(status: number, data: T): Response<T> {
    return { statusCode: status, jsonBody: data };
}

/** Generic api response for easier client manipulation. */
export interface Response<T> {
    statusCode: number;
    jsonBody: T | null;
}
