/** App **/
import fs from "fs";
import {parseParams, checkRequiredParams} from "../../../lib/utils/params";
import {writeLog} from "../../../lib/utils/logging";

/** OpenAI **/
import OpenAI from "../../../lib/node_modules/openai";

const openai = new OpenAI();

/**
 * Creates audio from text
 * https://platform.openai.com/docs/api-reference/audio/createTranscription
 *
 * @param params The parameters sent to the action from either url or POST body
 *
 * @param params.token The access token to use for authentication
 * Set as the ACCESS_TOKEN environment variable
 *
 * @param params.file The audio file object (not file name) to transcribe, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
 *
 * @param params.model The model id - currently on 'whisper-1' available
 *
 * @param params.language The language of the audio, if known, in ISO-639-1 format
 *
 * @param params.prompt The optional, supplemental guide for style or continuing audio.
 *
 * @param params.response_format The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.
 *
 * @param params.temperature The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random. Default is 0.
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        let args = {
            file: fs.createReadStream(params.file),
            model: params.model || "whisper-1",
            language: params.language || "en",
            response_format: params.response_format || "text",
            temperature: params.temperature || 0,
        };
        if (params.prompt) args.prompt = params.prompt;

        writeLog("Args:", args)
        const request = await openai.audio.transcriptions.create(args);
        writeLog("Request:", request)

        return {
            body: request,
            statusCode: 200
        };
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
    return ["file"];
}

global.main = main
