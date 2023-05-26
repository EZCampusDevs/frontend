import findCookie from "./findCookie";
import ENDPOINT from "./API";

export async function tryExecutiveAuth () {
    
        //Grab the Cookie:
        const token = findCookie('access_token', document.cookie);  
    
        //Make The Request:
        const RESPONSE = await fetch(ENDPOINT + 'user/check_exec_auth', {
            method: 'GET' , 
            headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token }
            }
        );

        return RESPONSE.status;
    
}

export async function InitRequest() {

    const token = findCookie('access_token', document.cookie);

    const response = await fetch(
      /*Endpoint URL */ ENDPOINT, 
      /*Req Params */{method: 'GET', headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token } } 
    )

    console.log(response)
    if(response.status === 200){
      return 1;
    }

    if(response.status === 401){
      return 0;
    }


}
