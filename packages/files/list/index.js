/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";
import {listOpenAiFiles} from "../../../lib/openai/files";

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
        let args = {};
        if (params.order) args['order'] = params.order;

        return successResponse(await listOpenAiFiles(args))
    } catch (error) {
        throw (errorFunctionResponse("Listing Files ", error));
    }
}

global.main = main
