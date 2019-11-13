import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const Portal: React.FC = ({ children }) => {
    const { current } = useRef(document.createElement("div"));
    const { body } = document;

    useEffect(() => {
        body.appendChild(current);

        return () => {
            body.removeChild(current);
        };
    }, []);

    return ReactDOM.createPortal(
        children,
        current
    );
};

export default Portal;
