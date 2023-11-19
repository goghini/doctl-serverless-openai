/** App **/
import {checkRequiredParams, parseParams} from "../../../lib/utils/params";
import {writeDebugLog} from "../../../lib/utils/logging";
import {getOpenAiAssistantFiles} from "../../../lib/openai/assistants";
import {errorFunctionResponse} from "../../../lib/utils/responses";

async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    if (params.assistant_id) params.id = params.assistant_id;
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        let args = {
            assistant_id: params.id
        };
        if (params.order) args['order'] = params.order;
        if (params.before) args['cursor'] = params.before;
        if (params.after) args['cursor'] = params.after;

        writeDebugLog("Args: ", args);
        const files = await getOpenAiAssistantFiles(args);
        writeDebugLog("Files:", files)

        return {
            body: files, statusCode: 200, headers: {
                'Content-Type': 'application/json'
            }
        }
    } catch (error) {
        throw (errorFunctionResponse("Retrieving Assistant Files ", error));
    }
}

/**
 * Returns the required params for this action
 * @returns {string[]}
 */
function requiredParams() {
    return ["id"];
}

global.main = main
