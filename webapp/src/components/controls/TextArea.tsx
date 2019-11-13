import React from "react";
import classNames from "classnames";

import styles from "./TextField.module.scss";

interface TextAreaProps extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement
> {
}

const TextArea: React.FC<TextAreaProps> = ({
    className,
    ...props
}) => {
    return (
        <textarea
            { ...props }
            className={ classNames(
                styles.textfield,
                styles.textarea,
                className
            ) }
        />
    );
};

export default TextArea;
