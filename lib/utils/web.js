import * as querystring from "querystring";

/**
 * Build a URL with namespace, package name, function name, and optional query parameters.
 * @param {string} packageName
 * @param {string} functionName
 * @param {Object} params - Optional query parameters
 * @returns {string} The constructed URL
 */
export function getUrl(packageName, functionName, params) {
    const baseUrl = process.env.DIGITALOCEAN_BASE_URL;
    const url = `${baseUrl}${packageName}/${functionName}`;
    const query = params ? `?${querystring.stringify(params)}` : '';
    return `${url}${query}`;
}
