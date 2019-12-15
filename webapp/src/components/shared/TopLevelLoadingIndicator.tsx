import React, { useState, useEffect } from "react";
import classNames from "classnames";

import { noop } from "../../utils";

import styles from "./TopLevelLoadingIndicator.module.scss";
import Portal from "./Portal";

export interface TopLevelLoadingIndicatorContextShape {
    status: boolean;
    setStatus: (loading: boolean) => void;
}

export const TopLevelLoadingIndicatorContext = React.createContext<
    TopLevelLoadingIndicatorContextShape
>({
    status: false,
    setStatus: noop,
});

const TopLevelLoadingIndicator: React.FC = ({
    children
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);

    const setStatus = (status: boolean) => {
        setLoading(status);
    };

    const renderIndicator = () => {
        return (
            <Portal>
                <div
                    className={ classNames(
                        styles.indicator,
                        visible && styles.active
                    ) }
                />
            </Portal>
        );
    };

    useEffect(() => {
        let timeout: number;

        if (!loading) {
            timeout = window.setTimeout(() => {
                setVisible(false);
            }, 300);
        } else {
            setVisible(true);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [loading]);

    const value: TopLevelLoadingIndicatorContextShape = {
        status: loading,
        setStatus,
    };

    return (
        <TopLevelLoadingIndicatorContext.Provider
            value={ value }
        >
            { renderIndicator() }
            { children }
        </TopLevelLoadingIndicatorContext.Provider>
    );
};

export default TopLevelLoadingIndicator;
