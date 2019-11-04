import React from "react";
import classNames from "classnames";

import styles from "./TextField.module.scss";

export interface TextFieldProps extends React.HTMLProps<HTMLInputElement> {
}

const TextField: React.FC<TextFieldProps> = ({
    className,
    ...props
}) => {
    return (
        <input
            { ...props }
            className={ classNames(
                styles.textfield,
                className
            ) }
        />
    );
};

export default TextField;
