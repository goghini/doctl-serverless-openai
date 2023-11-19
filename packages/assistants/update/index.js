/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {getOpenAiAssistant, updateOpenAiAssistant} from "../../../lib/openai/assistants"
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";

/**
 * Creates an assistant; although if an assistant is founding a matching name, that will be returned instead
 * https://platform.openai.com/docs/api-reference/assistants/createAssistant
 * @param params
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    if (params.assistant_id) params.id = params.assistant_id;
    const checkRequired = checkRequiredParams(params, requiredParameters());
    if (checkRequired) return checkRequired;

    try {
        const assistant = await getOpenAiAssistant(params);
        if (!assistant) return successResponse("Updating Assistant", "Assistant not found");

        const request = await updateOpenAiAssistant(params);

        return successResponse(request)
    } catch (error) {
        throw (errorFunctionResponse("Creating Assistant", error));
    }
}

/**
 *
 * @return {string[]}
 */
function requiredParameters() {
    return ["id"]
}

global.main = main
