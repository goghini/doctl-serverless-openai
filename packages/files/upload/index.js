/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";
import {uploadOpenAiFile} from "../../../lib/openai/files";

/**
 *
 * @param params
 * @return {Promise<{headers: {"Content-Type": string}, body, statusCode: number}|{body: string, statusCode: number}>}
 */
async function main (params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        return successResponse(await uploadOpenAiFile(params));
    } catch (error) {
        throw (errorFunctionResponse("Uploading File", JSON.stringify(error)));
    }
}

/**
 * Returns the required params for this action
 * @returns {string[]}
 */
function requiredParams () {
    return ["file"];
}

global.main = main
