/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {listOpenAiFilesWithFineTuneResultsPurpose} from "../../../lib/openai/files";
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";

async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params);
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        return successResponse(await listOpenAiFilesWithFineTuneResultsPurpose())
    } catch (error) {
        throw (errorFunctionResponse("Listing Files with 'fine-tune-results' purpose", error));
    }
}

global.main = main
