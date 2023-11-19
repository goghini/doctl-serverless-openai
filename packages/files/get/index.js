/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {writeLog} from "../../../lib/utils/logging";
import {getOpenAiFile} from "../../../lib/openai/files";
import {errorFunctionMessage, successResponse} from "../../../lib/utils/responses";

/**
 *
 * @param params
 * @return {Promise<{headers: {"Content-Type": string}, body, statusCode: number}|{body: string, statusCode: number}>}
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    if (params.file_id) params.id = params.file_id;
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    const fileId = params.id;

    // Here we go!
    try {
        const request = await getOpenAiFile(fileId)
        writeLog("Request:", request)

        return successResponse(request);
    } catch (error) {
        throw (errorFunctionMessage("Retrieving File " + fileId, error))
    }
}

/**
 * Returns the required params for this action
 * @returns {string[]}
 */
function requiredParams() {
    return ["id"];
}

global.main = main
