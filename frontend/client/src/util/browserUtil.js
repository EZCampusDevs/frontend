import findCookie from "./findCookie";

//This function get's called with some document.cookie as domCookie, and a function callback (setParameter)
export function cookieAuthCheck (domCookie, boolResponse) {

    if( findCookie('access_token', domCookie) || findCookie('token_type', domCookie) ){
        return boolResponse ? 1 : findCookie('access_token', domCookie);
    } else {
        return boolResponse ? 0 : null;
    }
}