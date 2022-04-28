import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[] ) => {
    const ErrorMap: Record<string, string> = {};
    errors.forEach(({field, message}) => {
        ErrorMap[field] = message;
    });
    return ErrorMap;
}