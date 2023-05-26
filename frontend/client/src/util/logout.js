import Cookies from 'universal-cookie';

const logout = () => {
 
    //Split each cookie
    const cookies = new Cookies();

    cookies.remove('token_type', { path: '/' });
    cookies.remove('access_token', { path: '/' });
    window.location.reload();
    
}

export default logout;