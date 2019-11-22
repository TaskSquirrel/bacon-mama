import React from "react";
import { Redirect } from "react-router-dom";

import useUser from "../hooks/useUser";

const Root: React.FC = () => {
    const {
        validated, error, token
    } = useUser();

    if (!validated) {
        return null;
    }

    if (error) {
        return (
            <div>
                There was an error communicating with the server.
            </div>
        );
    }

    if (!token) {
        return (
            <Redirect
                to="/sign-in"
            />
        );
    }

    return (
        <Redirect
            to="/dashboard"
        />
    );
};

export default Root;
