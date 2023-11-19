/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";
import {createOpenAiAssistantFile} from "../../../lib/openai/assistants";

/**
 * Creates an assistant file; although if an assistant is founding a matching name, that will be returned instead
 * https://platform.openai.com/docs/api-reference/assistants/createAssistant
 * @param params
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    try {
        const request = await createOpenAiAssistantFile(params);

        return successResponse(request || "No file action could be taken");
    } catch (error) {
        throw (errorFunctionResponse("Retrieving Assistant File ", error));
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
