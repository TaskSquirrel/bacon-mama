import React from "react";
import classNames from "classnames";

import styles from "./Stack.module.scss";

interface StackProps {
    className?: string;
    inline?: boolean;
    gap?: "big" | "bigger";
    onMouseOver?: () => void;
    onMouseOut?: () => void;
}

const Stack: React.FC<StackProps> = ({
    className,
    inline,
    gap,
    onMouseOver,
    onMouseOut,
    ...props
}) => {
    return (
        <div
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
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
