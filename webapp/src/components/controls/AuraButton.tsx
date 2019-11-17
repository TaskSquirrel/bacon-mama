import React from "react";
import classNames from "classnames";

import styles from "./AuraButton.module.scss";

export interface AuraButtonProps extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement
> {
    size?: "small" | "medium" | "large";
    shadow?: boolean;
}

const AuraButton: React.FC<AuraButtonProps> = ({
    size,
    shadow,
    className,
    ...props
}) => {
    return (
        <button
            { ...props }
            className={ classNames(
                styles.button,
                size && styles[size],
                shadow && styles.shadow,
                className
            ) }
        />
    );
};

export default AuraButton;
