import React from "react";
import classNames from "classnames";

import styles from "./Stack.module.scss";

interface StackProps {
    inline?: boolean;
    size?: "big" | "bigger";
}

const Stack: React.FC<StackProps> = ({
    inline,
    size,
    ...props
}) => {
    return (
        <div
            { ...props }
            className={ classNames(
                inline
                    ? styles.inline
                    : styles.stack,
                size && styles[size]
            ) }
        />
    );
};

export default Stack;
