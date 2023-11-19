import {listOpenAiAssistants} from "../../../lib/openai/assistants"
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";

/**
 * Lists all assistants
 * https://platform.openai.com/docs/api-reference/assistants/listAssistants
 * @param params
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params);
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        return successResponse(await listOpenAiAssistants(params));
    } catch (error) {
        throw (errorFunctionResponse("Listing Assistants", error));
    }
}

global.main = main
