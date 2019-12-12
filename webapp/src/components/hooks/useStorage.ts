import { useState, useEffect, useContext } from "react";

import StorageContext from "../Storage/StorageContext";

export interface UseStorageParams<T> {
    ready: boolean;
    value: T | null;
}

const useStorage = <P>(key: string, initialValue?: P) => {
    const [
        storageItem,
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

    const { ready, value } = storageItem;

    const remove = async () => {
        setStorageItem({
            ready: true,
            value: null
        });
    };

    const setValue = (val: P) => {
        if (val === storageItem.value) {
            return;
        }

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

        if (!storageItem.ready) {
            getFromStorage();
        }
    }, [getItem, key, storageItem]);

    useEffect(() => {
        if (!ready) {
            return;
        }

        if (value) {
            setItem(key, value);
        } else {
            removeItem(key);
        }
    }, [storageItem, removeItem, setItem, ready, key, value]);

    return {
        ready: storageItem.ready,
        value: storageItem.value,
        setValue,
        remove
    };
};

export default useStorage;
