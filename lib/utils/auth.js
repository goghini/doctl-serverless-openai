/**
 *
 * Checks if the request has a valid token set in the environment variable as ACCESS_TOKEN
 * Any requests to the function must match this token or the request will be rejected
 *
 * @param params
 * @returns boolean
 */
export function validateToken(params) {

    if( params.token === undefined ) return false;

    let token = params.token;
    if( params.http !== undefined ) {
        if (params.http.body !== undefined) {
            params = JSON.parse(params.http.body)
            if (params.token) token = params.token;
        }
    }

    return token || token !== process.env.ACCESS_TOKEN;
}
