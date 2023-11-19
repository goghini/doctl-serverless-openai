/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";
import {deleteOpenAiFile} from "../../../lib/openai/files";

/**
 * Deletes a file
 * @param params
 * @return {Promise<{headers: {"Content-Type": string}, body, statusCode: number}|{body: string, statusCode: number}>}
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    if (params.file_id) params.id = params.file_id;
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        return successResponse(await deleteOpenAiFile(params), {}, false);
    } catch (error) {
        throw (errorFunctionResponse("Deleting File", error));
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
