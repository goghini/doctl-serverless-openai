/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {deleteOpenAiAssistantFile} from "../../../lib/openai/assistants"
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";

/**
 * Creates an assistant file; although if an assistant is founding a matching name, that will be returned instead
 * @param params
 * @return {Promise<{headers: {"Content-Type": string}, body, statusCode: number}|{body: string, statusCode: number}>}
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    try {
        const request = await deleteOpenAiAssistantFile(params);

        return successResponse(request || "No matching assistant file could be found");
    } catch (error) {
        throw (errorFunctionResponse("Creating Assistant File ", error));
    }
}

/**
 * Returns the required params for this action
 * @return {string[]}
 */
function requiredParams() {
    return ["assistant_id", "file_id"];
}

global.main = main
