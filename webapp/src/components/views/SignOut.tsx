import React, { useEffect } from "react";

import useUser from "../hooks/useUser";

const SignOut: React.FC = () => {
    const {
        signOut
    } = useUser();

    useEffect(() => {
        signOut();
    });

    return null;
};

export default SignOut;
