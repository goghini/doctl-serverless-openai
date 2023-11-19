/** App **/
import {parseParams, checkRequiredParams} from "../../../lib/utils/params";

/** OpenAI **/
import OpenAI from "../../../lib/node_modules/openai";
const openai = new OpenAI();

/**
 * Creates a thread - a collection of messages with a single assistant
 * https://platform.openai.com/docs/api-reference/threads/createThread
 *
 * @param params The parameters sent to the action from either url or POST body
 *
 * @param params.token The access token to use for authentication
 * Set as the ACCESS_TOKEN environment variable
 *
 * @param params.messages The messages to create the thread with
 *
 * @param params.metadata Set of 16 key-value pairs that can be attached to an object for storing additional information about the object in a structured format.
 *
 * @returns {Promise<{body: *, statusCode: number}>}
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params);
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        let args = {};
        if( params.messages ) args['messages'] = params.messages;
        if( params.metadata ) args['metadata'] = params.metadata;

        const request = await openai.beta.threads.create(args);

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

global.main = main
