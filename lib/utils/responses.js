import {writeDebugLog, writeLog} from "./logging";

/**
 * Returns a success message
 * @param body
 * @param args
 * @param allowDebugLog
 * @return {{headers: {"Content-Type": string}, body, statusCode: number}}
 */
export function successResponse(body, args = {}, allowDebugLog = true) {
    if (allowDebugLog) writeDebugLog("Success Response: ", body)
    return {
        body: body, statusCode: args.statusCode || 200, headers: args.headers || {
            'Content-Type': 'application/json'
        }
    }
}

/**
 * Returns an error message
 * @param prefix
 * @param error
 * @param statusCode
 * @param headers
 * @return {{headers: {"Content-Type": string}, body: string, statusCode: number}}
 */
export function errorResponse(prefix, error, statusCode = 400, headers = {
    'Content-Type': 'application/json'
}) {
    writeDebugLog("Error " + (prefix || "") + ": " + error.message || error || "check server logs or contact system administrator", error);
    return {
        body: "Error " + (prefix || "") + ": " + error.message || error || "check server logs or contact system administrator",
        statusCode: statusCode || 400,
        headers: headers
    }
}

/**
 * Returns an error message
 * @param prefix
 * @param error
 * @param statusCode
 * @param headers
 * @return {{headers: {"Content-Type": string}, body: string, statusCode: number}}
 */
export function errorFunctionResponse(prefix, error, statusCode = 400, headers = {
    'Content-Type': 'application/json'
}) {
    writeLog("Function Error " + (prefix || "") + ": " + error.message || error || "check server logs or contact system administrator", error);
    return {
        body: "Function Error " + (prefix || "") + ": " + error.message || error || "check server logs or contact system administrator",
        statusCode: statusCode || 400,
        headers: headers
    }
}
