const maxLogLength = process.env.MAX_LOG_LENGTH || 3000;

/**
 * Logs messages
 *
 * Offers the option to log in Papertrail
 *
 * @param message
 */
export function writeLog(...message) {
    const stringifiedMessage = message.map(variable => {
        if (typeof variable !== "string") {
            variable = JSON.stringify(variable);
        }
        if (variable.length < maxLogLength) return variable;
        return variable.substring(0, maxLogLength) + "....truncated log for storage";
    });
    console.log(stringifiedMessage);
}

/**
 * Logs non-essential messages used only for debugging
 * @param message
 */
export function writeDebugLog(...message) {
    if (!process.env.DEBUG) return;

    writeLog(message);
}
