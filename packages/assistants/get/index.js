/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {getOpenAiAssistant} from "../../../lib/openai/assistants"
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";

/**
 * Retrieves an assistant
 *
 * @param params
 * @return {Promise<{headers: {"Content-Type": string}, body, statusCode: number}|{body: string, statusCode: number}>}
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params);
    if (checkRequired) return checkRequired;

    // Here we go
    try {
        const request = await getOpenAiAssistant(params);

        return successResponse(request || "Retrieving Assistant", "No assistant found")
    } catch (error) {
        throw (errorFunctionResponse("Retrieving Assistant", error));
    }

}

global.main = main
