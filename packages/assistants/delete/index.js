/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {deleteOpenAiAssistant, getOpenAiAssistant} from "../../../lib/openai/assistants"
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";

/**
 *
 * @param params
 * @return {Promise<{headers: {"Content-Type": string}, body, statusCode: number}|{body: string, statusCode: number}>}
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params);
    if (checkRequired) return checkRequired;

    try {
        const assistant = await getOpenAiAssistant(params);
        if (assistant) return successResponse(assistant);

        return successResponse(await deleteOpenAiAssistant(params))
    } catch (error) {
        throw (errorFunctionResponse("Creating Assistant", error));
    }
}

global.main = main
