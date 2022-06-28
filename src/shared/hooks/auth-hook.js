import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);

    const [tokenExpireDate, setTokenExpireDate] = useState();

    const [userId, setUserId] = useState(null);

    const login = useCallback((uid, token, expirationDate) => {

        setToken(token);

        setUserId(uid);

        //current time + expiresIn
        const tokenExpireDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

        setTokenExpireDate(tokenExpireDate);

        //globally available
        localStorage.setItem('userData', JSON.stringify({
          
            userId: uid, token: token, expire: tokenExpireDate.toISOString()
        
        }));

    }, []);

    const logout = useCallback(() => {

        setToken(null);

        setTokenExpireDate(null);

        setUserId(null);

        localStorage.removeItem('userData');

    }, []);

    useEffect(() => {

        if (token && tokenExpireDate) {

            const remainingTime = tokenExpireDate.getTime() - new Date().getTime();

            logoutTimer = setTimeout(logout, remainingTime);

        }
        else {

            clearTimeout(logoutTimer);

        }

    }, [token, logout, tokenExpireDate]);

    useEffect(() => {

        const storedData = JSON.parse(localStorage.getItem('userData'));

        if (storedData && storedData.token && new Date(storedData.expire) > new Date()) {

            login(storedData.userId, storedData.token, new Date(storedData.expire));

        }

    }, [login]);


    return {
        token,
        login,
        logout,
        userId
    }
};