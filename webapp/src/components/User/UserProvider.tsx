import React, { useState, useEffect } from "react";

import { APIUserLogin } from "../../models/API";

import UserContext, { UserContextShape } from "./UserContext";
import APIClient from "../../api/APIClient";

import useStorage from "../hooks/useStorage";

interface UserData {
    token: string | null;
    name: string;
    userID: string;
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
        setValue,
        remove
    } = useStorage<UserData>("USER");
    const [error, setError] = useState<boolean>(false);
    const [
        preflightRequestCompleted,
        setPreflightRequestCompleted
    ] = useState<boolean>(false);

    const signIn = async (
        name: string, password: string
    ) => {
        try {
            const { data: {
                status,
                message,
                token,
                userID,
                name: userName
            } } = await APIClient.request<APIUserLogin>(
                "/login",
                {
                    method: "POST",
                    data: {
                        username: name,
                        password
                    }
                }
            );

            if (status === "error") {
                throw new Error(message);
            } else {
                await setValue({
                    token, userID, name: userName,
                });
            }
        } catch (e) {
            throw e;
        }
    };

    const signOut = async () => remove();

    useEffect(() => {
        if (preflightRequestCompleted || !ready || !value) {
            // Do not need to validate user (not logged in).
            // Or if storage hasn't loaded yet.

            return;
        }

        const dispatchPreflightValidation = async () => {
            try {
                const { data: {
                    status
                } } = await APIClient.request(
                    "/validate",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `${value.token}`
                        },
                        data: {}
                    }
                );

                if (status === "error") {
                    // Failed to validate
                    remove();

                    throw new Error();
                }
            } catch (e) {
                console.warn(`[UserProvider] Validation request failed!`);

                setError(true);
            } finally {
                setPreflightRequestCompleted(true);
            }
        };

        dispatchPreflightValidation();
    }, [remove, ready, value, preflightRequestCompleted]);

    if (!ready) {
        return null;
    }

    const context: UserContextShape = {
        signIn,
        signOut,
        error,
        validated: preflightRequestCompleted,
        token: value ? value.token : null,
        name: value ? value.name : null,
        userID: value ? value.userID : null
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
