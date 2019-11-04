import React from "react";
import classNames from "classnames";

import styles from "./ButtonBase.module.scss";

export interface ButtonBaseProps extends React.HTMLProps<HTMLButtonElement> {
    className?: string;
}

const ButtonBase: React.FC<ButtonBaseProps> = ({
    children,
    className
}) => {
    return (
        <button
            className={ classNames(
                styles.base,
                className
            ) }
        >
            { children }
        </button>
    );
};

export default ButtonBase;
