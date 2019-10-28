import React from "react";
import { noop } from "../../utils";

export interface StorageContextShape {
    getItem: (item: string) => Promise<any>;
    setItem: (key: string, value: any) => Promise<any>;
    removeItem: (item: string) => Promise<void>;
    clear: () => Promise<void>;
}

const StorageContext = React.createContext<StorageContextShape>({
    getItem: noop,
    setItem: noop,
    removeItem: noop,
    clear: noop
});

export default StorageContext;
