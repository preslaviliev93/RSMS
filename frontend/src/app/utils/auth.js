import { jwtDecode } from "jwt-decode"; 
import axios from "axios";


export function saveTokens({accessToken, refreshToken}) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    
}

export function getAccessToken() {
    return localStorage.getItem("accessToken");
}
export function getRefreshToken() {
    return localStorage.getItem("refreshToken");
}

export function clearAuthData() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
}

export function tokenExpired(token) {
    try {
        const {exp} = jwtDecode(token);
        return exp * 1000 < Date.now(); // True = token is expired

    } catch (error) {
        console.warn(`Something went wrong while checking if token is expired: ${error}`);
        return true;
    }
}


export function getUserData() {
    const token = getAccessToken();
    if (!token) return null;
    
    try {
        const decodedToken = jwtDecode(token);

        const userData = {
            username: decodedToken.username,
            is_staff: decodedToken.is_staff,
            role: decodedToken.role,
        };

        localStorage.setItem('userData', JSON.stringify(userData)); // <-- Save userData

        return userData;
    } catch (err) {
        console.warn(`Something went wrong while decoding the token: ${err}`);
        return null;
    }
}


export async function logout(){
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    try{
        const token = getAccessToken();
        const refresh = getRefreshToken();
        if(!token || !refresh) return;
        
        await axios.post(`${API_URL}/users/logout/`, 
            { refresh: refresh}, 
            {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }catch(err){
        console.warn(`Something went wrong while logging out: ${err}`);
    }finally{
       clearAuthData(); // Clear auth data after logout 
    } 
}


// export function isLoggedIn(){
//     try{
//         const token = getAccessToken();
//         if(!token) return false;
//         return !!token;
//     }catch(error){
//         console.warn(`Something went wrong while checking if user is logged in: ${error}`);
//         return false;
//     }
// }

export function isLoggedIn(){
    const token = getAccessToken();
    return token && !tokenExpired(token);
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function tryRefresh() {
    const refresh = getRefreshToken();
    if(!refresh) return false;
    try{
        const {data} = await axios.post(`${API_URL}/users/token/refresh/`,{
            refresh,
        });
        saveTokens({
            accessToken: data.access,
            refreshToken: data.refresh ||refresh,
        });
        return true;
    } catch (error){
        clearAuthData();
        return false;
    }
}