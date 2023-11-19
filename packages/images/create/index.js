/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";

/** OpenAI **/
import OpenAI from "../../../lib/node_modules/openai";
import {errorFunctionResponse, successResponse} from "../../../lib/utils/responses";

const openai = new OpenAI();

/**
 * Creates image(s) from a prompt with configurable paramaters
 * https://platform.openai.com/docs/api-reference/images/create
 * @param params
 *
 * @returns {Promise<{body: *, statusCode: number}>}
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        const dallE3 = "dall-e-3";
        const model = params.model || dallE3;
        const isDallE3 = model === dallE3;

        let args = {
            prompt: params.prompt,
            model: model,
            n: isDallE3 ? 1 : (params.n || 1), // Current Limit on 10th November 2023
            response_format: params.response_format || "url",
            size: params.size || process.env.OPENAI_IMAGE_SIZE || (isDallE3 ? '1792x1024' : '1024x1024'),
        };
        if (isDallE3 && params.style) args['style'] = params.style;
        if (params.user) args['user'] = params.user;

        return successResponse(await openai.images.generate(args))
    } catch (error) {
        throw (errorFunctionResponse("Creating Image", error));
    }
}

/**
 * Returns the required params for this action
 * @returns {string[]}
 */
function requiredParams() {
    return ["prompt"];
}

global.main = main
