/** App **/
import {parseParams, checkRequiredParams} from "../../../lib/utils/params";
import {writeLog} from "../../../lib/utils/logging";

/** OpenAI **/
import OpenAI from "../../../lib/node_modules/openai";

const openai = new OpenAI();

async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    if (params.thread_id) params.id = params.thread_id;
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        const thread_id = params.id;
        const metadata = params.metadata;

        writeLog("Thread ID: ", thread_id, "Metadata: ", metadata);
        const request = await openai.beta.threads.update(thread_id, metadata)
        writeLog("Request:", request)

        return {
            body: request, statusCode: 200, headers: {
                'Content-Type': 'application/json'
            }
        }
    } catch (error) {
        console.error("Error:", error.message || error);

        return {
            body: "Error: " + error.message || error,
            statusCode: 500
        }
    }
}

/**
 * Returns the required params for this action
 * @returns {string[]}
 */
function requiredParams() {
    return ["id", "metadata"];
}

global.main = main
