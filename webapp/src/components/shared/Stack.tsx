import React from "react";
import classNames from "classnames";

import styles from "./Stack.module.scss";

interface StackProps {
    className?: string;
    inline?: boolean;
    gap?: "big" | "bigger";
}

const Stack: React.FC<StackProps> = ({
    className,
    inline,
    gap,
    ...props
}) => {
    return (
        <div
            { ...props }
            className={ classNames(
                inline
                    ? styles.inline
                    : styles.stack,
                gap && styles[gap],
                className
            ) }
        />
    );
};

export default Stack;
