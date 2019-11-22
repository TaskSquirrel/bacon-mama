import React from "react";
import { Redirect } from "react-router-dom";

import useUser from "../hooks/useUser";

import DelayedIndicator from "../shared/DelayedIndicator";

const Root: React.FC = () => {
    const {
        validated, error, token
    } = useUser();

    if (!validated) {
        return (
            <DelayedIndicator />
        );
    }

    if (error) {
        return (
            <DelayedIndicator
                text="We're having issues connecting to the server..."
            />
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
