/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {listOpenAiFilesWithAssistantsPurpose} from "../../../lib/openai/files";
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

    // Here we go!
    try {
        return successResponse(await listOpenAiFilesWithAssistantsPurpose())
    } catch (error) {
        throw (errorFunctionResponse("Listing Files with 'assistants' purpose", error));
    }
}

global.main = main
