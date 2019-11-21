import React, { useState, useEffect } from "react";

import UserContext from "./UserContext";
import useStorage from "../hooks/useStorage";
import { AxiosRequestConfig } from 'axios';
import useAPI from "../hooks/useAPI";

interface UserData {
    token: string | null;
}

/**
 * Before loading any content on the page the `UserProvider` waits until
 * the browser storage is loaded. A preflight request is sent to an API
 * server every time the page loads to ensure the user token stored is
 * legitimate.
 */
const UserProvider: React.FC = ({ children }) => {
    const {
        ready,
        value,
        set,
        remove
    } = useStorage<UserData>("USER");
    const [pre, setPre] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const request = useAPI();

    const signIn = (
        name: string, password: string
    ) => {
        
    };

    const signOut = () => {
        remove();
    };

    useEffect(() => {
        if (!pre && value && value.token) {
            signOut();
        }

        if(value && value.token){
            doRequest(
                "/validateID",
                {
                    method: "POST",
                    data: {
                        token: value ? value.token : null
                    }
                }
            );
        }

    }, [pre, value]);

    const doRequest = async (
        endpoint: string,
        payload: AxiosRequestConfig
    ) => {
        try {

            const {
                data
            } = await request(
                endpoint,
                payload
            );            

            const { status, message, username } = data;

            if (status === "OK") {
                setUsername(username);
            } else {
                throw new Error(message);
            }
        } catch (e) {
            if (!e.message) {
                throw new Error("Network request failed!");
            } else {
                throw e;
            }
        } finally {
            
        }
    };

    if (!ready) {
        return null;
    }

    console.log(ready);

    const context = {
        username,
        signIn,
        signOut,
        token: value ? value.token : null
    };
    
    

    return (
        <UserContext.Provider
            value={ context }
        >
            
            { children }
        </UserContext.Provider>
    );
};

export default UserProvider;
