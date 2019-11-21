import React from "react";

import { noop } from "../../utils";

export interface UserContextShape {
    signIn: (username: string, password: string) => void;
    signOut: () => void;
    token: string | null;
    name: string | null;
    userID: string | null;
    validated: boolean;
    error: boolean;
}

const UserContext = React.createContext<UserContextShape>({
    signIn: noop,
    signOut: noop,
    token: null,
    name: null,
    userID: null,
    validated: false,
    error: false
});

export default UserContext;
