/** App **/
import {parseParams, checkRequiredParams} from "../../../lib/utils/params";

/** OpenAI **/
import OpenAI from "../../../lib/node_modules/openai";
import {writeLog} from "../../../lib/utils/logging";
import {getUrl} from "../../../lib/utils/web";

const openai = new OpenAI();

/**
 * Creates audio from text
 * https://platform.openai.com/docs/api-reference/audio/createSpeech
 *
 * @param params The parameters sent to the action from either url or POST body
 *
 * @param params.token The access token to use for authentication
 * Set as the ACCESS_TOKEN environment variable
 *
 * @param params.model One of the available TTS models: tts-1 or tts-1-hd
 * Default set as the OPENAI_MODEL_TTS environment variable
 * For more info and list of options, visit here: https://platform.openai.com/docs/models/tts
 *
 * @param params.input The string to convert into audio
 *
 * @param params.voice The voice to use for the conversion
 * Default set as the OPENAI_VOICE environment variable
 * For more info and list of options, visit here: https://platform.openai.com/docs/guides/text-to-speech/voice-options
 *
 * @param params.response_format The buffer format of the response: mp3, opus, aac or flac
 * Default is mp3
 *
 * @param params.speed The speed of the audio: min is 0.25, max is 4.0
 * Default is 1
 *
 * @return {Promise<{body: *, statusCode: number}>}
 */
async function main(params) {

    // Let's always start with this, so we know we have the right params and the user has access
    params = parseParams(params);
    const checkRequired = checkRequiredParams(params, requiredParams());
    if (checkRequired) return checkRequired;

    // Here we go!
    try {
        const args = {
            model: params.model || process.env.OPENAI_MODEL_TTS,
            voice: params.voice || process.env.OPENAI_VOICE,
            input: params.input,
            response_format: params.response_format || 'mp3',
            speed: params.speed || 1.0
        };

        writeLog("Args:", args)
        let audio = await openai.audio.speech.create(args);
        writeLog("Audio:", audio);
        audio = await audio.arrayBuffer();
        writeLog(getUrl('audio', 'speech', params))

        return {
            body: Buffer.from(audio).toString('base64'),
            statusCode: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Transfer-Encoding': 'binary'
            }
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
    return ["input"];
}

global.main = main
