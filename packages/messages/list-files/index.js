/** App **/
import {parseParams, checkRequiredParams} from "../../../lib/utils/params";
import {writeLog} from "../../../lib/utils/logging";

/** OpenAI **/
import OpenAI from "../../../lib/node_modules/openai";

const openai = new OpenAI();

async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params);
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        let args = {
            purpose: "assistants"
        };

        writeLog("Args: ", args);
        const request = await openai.files.list(args)
        writeLog("Request:", request)

        return {
            body: request.data, statusCode: 200, headers: {
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
