import React, { useState, useEffect } from "react";
import classNames from "classnames";

import { noop } from "../../utils";

import styles from "./TopLevelLoadingIndicator.module.scss";

export interface TopLevelLoadingIndicatorContextShape {
    setStatus: (loading: boolean) => void;
}

export const TopLevelLoadingIndicatorContext = React.createContext<
    TopLevelLoadingIndicatorContextShape
>({
    setStatus: noop
});

const TopLevelLoadingIndicator: React.FC = ({
    children
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);

    const setStatus = (status: boolean) => {
        if (status) {
            setVisible(true);
        }

        setLoading(status);
    };

    const renderIndicator = () => {
        return (
            <div
                className={ classNames(
                    styles.indicator,
                    visible && styles.active
                ) }
            />
        );
    };

    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                setVisible(false);
            }, 300);
        }
    }, [loading]);

    const value: TopLevelLoadingIndicatorContextShape = {
        setStatus
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
