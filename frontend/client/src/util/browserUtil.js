import findCookie from "./findCookie";
import Cookies from 'universal-cookie';

export const ACCESS_LINK_NAME = "access_link";

//This function get's called with some document.cookie as domCookie, and a function callback (setParameter)
export function cookieAuthCheck (domCookie, boolResponse) {

    if( findCookie('access_token', domCookie) || findCookie('token_type', domCookie) ){
        return boolResponse ? 1 : findCookie('access_token', domCookie);
    } else {
        return boolResponse ? 0 : null;
    }
}

//This function clears a User's Login Cookies hence logging them out
export function logout() {
 
    //Split each cookie
    const cookies = new Cookies();

    cookies.remove('token_type', { path: '/' });
    cookies.remove('access_token', { path: '/' });
    window.location.reload();
    
}

//This function saves a User's School subdomain prefix , maps it, and stores in Localstorage

//* HARD CODED Subdomain : tbl_school.school_unique_value

const SUBDOMAIN_KEYS = {
    "otu" : "Ontario Tech University - Canada",
    "uvic" : "University of Victoria - Canada",
    "dc" : "Durham College - Canada"
}

export function LSLoadSchool() {

    // Get the absolute URL the user is currently on
    const currentUrl = window.location.href;
    let subdomain = extractSubdomain(currentUrl);
    
    console.log(subdomain);
    //!REMOVE THIS IN PRODUCTION
    if(subdomain === "localhost:3000/"){ subdomain = "otu"}
    //!REMOVE THIS IN PRODUCTION
    
    if(subdomain === 'ezcampus' || !subdomain) { return false; }

    //Finds Matching value to key in SUBDOMAIN_KEYS
    const matchingValue = Object.keys(SUBDOMAIN_KEYS).find(key => key === subdomain) && SUBDOMAIN_KEYS[subdomain];

    console.log("MATCHING: "+matchingValue);

    if(matchingValue) {
        localStorage.setItem('school_name', matchingValue);
        return true;
    } 
    return false;
}

export function getPathFromUrl() {
    const currentUrl = new URL(window.location.href);
    let path = currentUrl.pathname;
    // Remove the leading slash if it exists
    if (path.startsWith('/')) {
        path = path.slice(1);
    }
    return path;
}

function extractSubdomain(url) {
        // Remove the protocol part (e.g., http:// or https://) from the URL
        const withoutProtocol = url.replace(/^(https?:\/\/)?/, '');
    
        // Extract the subdomain using regular expression
        const subdomainMatch = withoutProtocol.match(/^([^.]+)/);
    
        // If a subdomain is found, return it; otherwise, return an empty string
        return subdomainMatch ? subdomainMatch[0] : '';
}

export function loadSchool() {


    const LSLS = LSLoadSchool();

    if (LSLS) { return true;}     //If OK, Return True, OK meaning a school has been found

    //Check if an Access Link Variable is set
    const link = localStorage.getItem(ACCESS_LINK_NAME);

    if(!LSLS && !link) {
          const urlPath = getPathFromUrl(); // location/to/thing?p=123

          localStorage.setItem(ACCESS_LINK_NAME, urlPath); //Sets the URL path in an `access_link` variable 
        //   window.location.href = "/institutions" ;
    }

    return false;
}

export function getAccessLink() {
    const link = localStorage.getItem(ACCESS_LINK_NAME);
    
    if(link) {
        localStorage.removeItem(ACCESS_LINK_NAME); //Remove it, then return so usr can be redirected
        return link;
    }

}
