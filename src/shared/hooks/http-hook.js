import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setIsLoading(true);
            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    signal: httpAbortCtrl.signal
                });

                const responseData = await response.json();

                activeHttpRequests.current = activeHttpRequests.current.filter(
                    reqCtrl => reqCtrl !== httpAbortCtrl
                );

                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                setIsLoading(false);
                return responseData;
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
                throw err;
            }
        },
        []
    );

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return { isLoading, error, sendRequest, clearError };
};

// import { useState, useCallback, useRef, useEffect } from 'react';

// export const useHttpClient = () => {

//     const [isLoading, setIsLoading] = useState(false);

//     const [error, setError] = useState();

//     //when user switches to another page in between requests, we want to cancel the request
//     //piece of data which will not change during the lifetime of the component
//     const activeHttpRequests = useRef([]);

//     const sendRequest = useCallback(

//         async (url, method = 'GET', body = null, headers = {}) => {

//             setIsLoading(true);

//             //api supported in modern browsers
//             const httpAbortCtrl = new AbortController();

//             activeHttpRequests.current.push(httpAbortCtrl);

//             try {

//                 const response = await fetch(url, {
//                     method,
//                     body,
//                     headers,
//                     signal: httpAbortCtrl.signal,
//                 });

//                 const responseData = await response.json();

//                 //removing abortControl if request completes
//                 activeHttpRequests.current = activeHttpRequests.current.filter(
//                     reqCtrl => reqCtrl !== httpAbortCtrl
//                 ); 

//                 if (!response.ok) {
//                     throw new Error(responseData.message);
//                 }

//                 setIsLoading(false);

//                 return responseData;

//             }
//             catch (err) {

//                 setError(err.message);

//                 setIsLoading(false);

//                 throw err;

//             }


//         }, []);

//     const clearError = () => {
//         setError(null);
//     }

//     useEffect(() => {
//         return () => {
//             //cleanup function before next useEffect
//             activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
//         }
//     }, []);

//     return { isLoading, error, sendRequest, clearError };

// };