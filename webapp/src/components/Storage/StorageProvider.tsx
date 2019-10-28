import React, { useState, useEffect } from "react";
import localForage from "localforage";

import StorageContext, { StorageContextShape } from "./StorageContext";

export interface StorageProviderProps {
    store: string;
}

const StorageProvider: React.FC<StorageProviderProps> = ({
    children,
    store
}) => {
    const {
        getItem,
        setItem,
        removeItem,
        clear
    } = localForage.createInstance({
        name: store,
        driver: localForage.INDEXEDDB
    });

    const value: StorageContextShape = {
        getItem,
        setItem,
        removeItem,
        clear
    };

    return (
        <StorageContext.Provider
            value={ value }
        >
            { children }
        </StorageContext.Provider>
    );
};

export default StorageProvider;
