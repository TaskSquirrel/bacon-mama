import React from "react";
import classNames from "classnames";

import styles from "./ButtonBase.module.scss";

export interface ButtonBaseProps extends React.HTMLProps<HTMLButtonElement> {
    className?: string;
    inverted?: boolean;
    clear?: boolean;
    noHover?: boolean;
    type?: "button" | "submit" | "reset";
}

const ButtonBase: React.FC<ButtonBaseProps> = ({
    children,
    inverted,
    clear,
    noHover,
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
                (noHover || clear) && styles["no-hover"],
                clear && styles.clear,
                className
            ) }
        >
            { children }
        </button>
    );
};

export default ButtonBase;
