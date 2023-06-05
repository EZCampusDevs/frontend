import findCookie from "./findCookie";
import Cookies from 'universal-cookie';

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
    "uvic" : "University of Victory - Canada"
}

export function LSLoadSchool() {

    // Get the absolute URL the user is currently on
    const currentUrl = window.location.href;
    let subdomain = extractSubdomain(currentUrl);
    
    //!REMOVE THIS IN PRODUCTION
    if(subdomain === "localhost:3000/"){ subdomain = "otu"}
    //!REMOVE THIS IN PRODUCTION
    
    if(subdomain === '' || !subdomain) { return; }

    //Finds Matching value to key in SUBDOMAIN_KEYS
    const matchingValue = Object.keys(SUBDOMAIN_KEYS).find(key => key === subdomain) && SUBDOMAIN_KEYS[subdomain];

    localStorage.setItem('school_name', matchingValue);
  }
  

    function extractSubdomain(url) {
        // Remove the protocol part (e.g., http:// or https://) from the URL
        const withoutProtocol = url.replace(/^(https?:\/\/)?/, '');
    
        // Extract the subdomain using regular expression
        const subdomainMatch = withoutProtocol.match(/^([^.]+)/);
    
        // If a subdomain is found, return it; otherwise, return an empty string
        return subdomainMatch ? subdomainMatch[0] : '';
    }