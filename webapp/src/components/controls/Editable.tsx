import React, { useState, useRef, useEffect, useCallback } from "react";
import classNames from "classnames";

import styles from "./Editable.module.scss";

interface EditableProps {
    className?: string;
    text: string;
    onEnterPress?: (text: string) => void;
}

const Editable: React.FC<EditableProps> = ({
    className,
    text,
    onEnterPress
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [active, setActive] = useState<boolean>(false);
    const [input, setInput] = useState<string>(text);

    const onTextClick = () => {
        setActive(true);
    };

    const onTextBlur = useCallback(
        () => {
            setActive(false);
            setInput(text);
        },
        [text]
    );

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const renderText = () => {
        if (active) {
            return (
                <input
                    ref={ inputRef }
                    type="text"
                    className={ classNames(
                        styles.text,
                        styles.editing
                    ) }
                    value={ input }
                    onChange={ onInputChange }
                    onBlur={ onTextBlur }
                />
            );
        } else {
            return (
                <div
                    className={ classNames(
                        styles.text
                    ) }
                    onClick={ onTextClick }
                >
                    { input }
                </div>
            );
        }
    };

    useEffect(() => {
        const { current } = inputRef;

        if (current) {
            current.focus();
        }
    }, [active]);

    useEffect(() => {
        if (!active) {
            return;
        }

        const onEnter = (event: KeyboardEvent) => {
            if (event.code === "Enter") {
                onTextBlur();

                if (typeof onEnterPress === "function") {
                    onEnterPress(input);
                }
            }
        };

        document.addEventListener("keydown", onEnter);

        return () => document.removeEventListener("keydown", onEnter);
    }, [active, input, onEnterPress, onTextBlur]);

    useEffect(() => {
        setInput(text);
    }, [text]);

    return (
        <div
            className={ classNames(
                styles.container,
                active && styles.active,
                className
            ) }
        >
            { renderText() }
        </div>
    );
};

export default Editable;
