import React, { useState, useEffect } from "react";

import Spinner from "./Spinner";

import styles from "./DelayedIndicator.module.scss";

enum IndicatorState {
    START, FIRST, SECOND
}

interface DelayedIndicatorProps {
    firstDelay?: number;
    secondDelay?: number;
    text?: string;
}

const DelayedIndicator: React.FC<DelayedIndicatorProps> = ({
    firstDelay, secondDelay, text
}) => {
    const [status, setStatus] = useState<IndicatorState>(IndicatorState.START);

    const renderSpinner = () => {
        return (
            <Spinner
                className={ styles.spinner }
            />
        );
    };

    const renderStatement = () => {
        if (status !== IndicatorState.SECOND) {
            return null;
        }

        const showText = text || "We're having trouble connecting to the server...";

        return (
            <div
                className={ styles.text }
            >
                { showText }
            </div>
        );
    };

    useEffect(() => {
        if (status !== IndicatorState.START) {
            return;
        }

        const delay = firstDelay || 1000;

        let timer: number;

        timer = window.setTimeout(() => {
            setStatus(IndicatorState.FIRST);
        }, delay);

        return () => window.clearTimeout(timer);
    }, [firstDelay, status]);

    useEffect(() => {
        if (status !== IndicatorState.FIRST) {
            return;
        }

        const delay = secondDelay || 3000;

        let timer: number;

        timer = window.setTimeout(() => {
            setStatus(IndicatorState.SECOND);
        }, delay);
    }, [secondDelay, status]);

    if (status === IndicatorState.START) {
        return null;
    }

    return (
        <div
            className={ styles.container }
        >
            { renderSpinner() }
            { renderStatement() }
        </div>
    );
};

export default DelayedIndicator;
