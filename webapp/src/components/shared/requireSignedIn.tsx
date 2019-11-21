import React from "react";
import { Redirect } from "react-router-dom";

import useUser from "../hooks/useUser";

const requireSignedIn = (
    invert?: boolean,
    render?: () => React.ReactElement,
    renderOnError?: () => React.ReactElement
) => (Component: React.FC) => {
    const RequireSignedIn: React.FC = (props) => {
        const {
            validated,
            error,
            token
        } = useUser();

        if (error) {
            return typeof renderOnError === "function"
                ? renderOnError()
                : (
                    <Redirect
                        to="/"
                    />
                );
        }

        if (!validated && !invert) {
            return null;
        }

        if ((token && !invert) || (!token && invert)) {
            return (
                <Component
                    { ...props }
                />
            );
        }

        return render ? render() : (
            <Redirect
                to="/"
            />
        );
    };

    const componentName = Component.displayName || Component.name || "Component";

    RequireSignedIn.displayName = `requireSignIn(${componentName})`;

    return RequireSignedIn;
};

export default requireSignedIn;
