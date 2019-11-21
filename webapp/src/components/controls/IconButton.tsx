import React from "react";
import classNames from "classnames";

import ButtonBase from "./ButtonBase";

import styles from "./IconButton.module.scss";

interface IconButtonProps {
    className?: string;
    border?: boolean;
    onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
    className,
    border,
    onClick,
    ...props
}) => {
    return (
        <ButtonBase
            { ...props }
            inverted
            noHover
            className={ classNames(
                styles.button,
                !border && styles["no-border"],
                className
            ) }
            onClick={ onClick }
        />
    );
};

export default IconButton;
