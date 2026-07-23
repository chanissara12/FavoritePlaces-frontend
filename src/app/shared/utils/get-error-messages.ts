import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { ErrorService } from "../error.service";
import { throwError } from "rxjs";

export function getErrorMessages(error: HttpErrorResponse): string {
    let errorMessages: string = error.error.errors.map((err: { message: string; }) => err.message as string)
    .join("\r\n")

    return errorMessages
}