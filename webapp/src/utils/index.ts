import React from "react";

export async function noop() {
    // noop
}

export const getAPIURL = () => {
    const {
        REACT_APP_API: API_URL,
        REACT_APP_API_PROD: PROD,
        NODE_ENV
    } = process.env;
    const IN_PRODUCTION = NODE_ENV === "production";
    const URL = IN_PRODUCTION ? PROD : API_URL;

    const USE_URL = URL || "localhost:8080/api";

    return USE_URL;
};

export const getImageURL = (image: string) => {
    return `http://${getAPIURL()}/images/${image}`;
};

export const randomRange = (range: number) => {
    const num = Math.random() * range;
    const result = num - range / 2;

    return result;
};

export const createChangeEventStateSetter = (
    setter: React.Dispatch<React.SetStateAction<string>>
) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(event.target.value);
};

export const isNumber = (test: string) => {
    try {
        const asNumber = Number(test);

        return !isNaN(asNumber);
    } catch (e) {
        return false;
    }
};

export const shuffle = <T>(arr: T[]) => {
    const newArray = [...arr];

    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);

        const t = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = t;
    }

    return newArray;
};
