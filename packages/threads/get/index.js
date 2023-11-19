/** App **/
import {parseParams, checkRequiredParams} from "../../../lib/utils/params";

/** OpenAI **/
import OpenAI from "../../../lib/node_modules/openai";
import {writeLog} from "../../../lib/utils/logging";

const openai = new OpenAI();

/**
 * Creates a thread - a collection of messages with a single assistant
 * https://platform.openai.com/docs/api-reference/threads/deleteThread
 *
 * @param params The parameters sent to the action from either url or POST body
 *
 * @param params.token The access token to use for authentication
 * Set as the ACCESS_TOKEN environment variable
 *
 * The thread id to retrieve. Either work.
 * @param params.thread_id
 * @param params.id
 *
 * @returns {Promise<{body: *, statusCode: number}>}
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    if (params.thread_id) params.id = params.thread_id;
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        const thread_id = params.id;

        writeLog("Thread ID:", thread_id)
        const request = await openai.beta.threads.del(thread_id);
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
    return ["id"];
}

global.main = main
