import { HttpErrorResponse } from "@angular/common/http";

export function getErrorMessages(error: HttpErrorResponse): string {
    let errorMessages: string = error.error.errors.map((err: { message: string; }) => err.message as string)
    .join("\r\n")

    return errorMessages
}