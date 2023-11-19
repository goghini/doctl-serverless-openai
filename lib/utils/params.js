import {validateToken} from "./auth";
import {successResponse} from "./responses";
import {writeDebugLog} from "./logging";

/**
 * Parse params so we are using the POST ones with priority rather than the url, if available
 *
 * @param params
 * @param allowDebugLog
 * @returns {*}
 */
export function parseParams(params, allowDebugLog = true) {
    if (allowDebugLog) writeDebugLog(params);

    let token = params.token || null;

    if (params.http !== undefined) {
        if (params.http.body !== undefined) {
            params = JSON.parse(params.http.body);
            if (params.token === undefined) params.token = token;
        }
    }

    return params;
}


/**
 * Checks if we have all the required params
 * @param params
 * @param required
 * @returns {{body: string, statusCode: number}|null}
 */
export function checkRequiredParams(params, required = []) {

    // Validate their access token
    if (!validateToken(params)) return successResponse("Unauthorized. Token not provided or invalid", 403)

    if (required === undefined) return null;

    for (const param of required) {
        if (params[param] === undefined) {
            return successResponse("Request made without required parameter '" + param + "'", 401);
        }
    }

    return null;
}
