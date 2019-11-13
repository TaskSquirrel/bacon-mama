import React from "react";
import classNames from "classnames";

import styles from "./ButtonBase.module.scss";

export interface ButtonBaseProps extends React.HTMLProps<HTMLButtonElement> {
    className?: string;
    inverted?: boolean;
    type?: "button" | "submit" | "reset";
}

const ButtonBase: React.FC<ButtonBaseProps> = ({
    children,
    inverted,
    className,
    type,
    ...props
}) => {
    return (
        <button
            { ...props }
            type={ type }
            className={ classNames(
                styles.base,
                inverted && styles.inverted,
                className
            ) }
        >
            { children }
        </button>
    );
};

export default ButtonBase;
