import React, { useEffect } from "react";
import useStorage from "./hooks/useStorage";

const Test: React.FC = () => {
    const {
        ready,
        value,
        set
    } = useStorage("token");

    return (
        <div>
            { ready ? "READY" : "NOT READY" }
            { value }
        </div>
    );
};

export default Test;
