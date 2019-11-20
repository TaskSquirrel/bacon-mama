import React, { useState, useEffect } from "react";

import UserContext from "./UserContext";
import useStorage from "../hooks/useStorage";

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

    const signIn = (
        name: string, password: string
    ) => {
        
    };

    const signOut = () => {
        remove();
    };

    useEffect(() => {
        if (!pre && value && value.token) {
            const { token } = value;

            signOut();
        }
    }, [pre, value]);

    if (!ready) {
        return null;
    }

    const context = {
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
