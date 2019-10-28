import { useState, useEffect, useContext } from "react";

import StorageContext from "../Storage/StorageContext";

export interface UseStorageParams<T> {
    ready: boolean;
    value: T | null;
}

const useStorage = <P>(key: string, initialValue?: P) => {
    const [
        { ready, value },
        setStorageItem
    ] = useState<UseStorageParams<P>>({
        ready: false,
        value: initialValue || null
    });
    const {
        getItem,
        setItem,
        removeItem
    } = useContext(StorageContext);

    const remove = async () => {
        await removeItem(key);
        setStorageItem({
            ready: true,
            value: null
        });
    };

    const set = async (val: P) => {
        if (val === value) {
            return;
        }

        await setItem(key, val);
        setStorageItem({
            ready: true,
            value: val
        });
    };

    useEffect(() => {
        const getFromStorage = async () => {
            const item = await getItem(key);

            setStorageItem({
                ready: true,
                value: item as P
            });
        };

        getFromStorage();
    }, [getItem, key, ready]);

    return {
        ready,
        value,
        set,
        remove
    };
};

export default useStorage;
