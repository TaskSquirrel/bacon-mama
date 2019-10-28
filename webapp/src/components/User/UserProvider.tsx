import React, { useState, useEffect } from "react";

import UserContext from "./UserContext";
import useStorage from "../hooks/useStorage";

interface UserData {
    token: string | null;
}

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
