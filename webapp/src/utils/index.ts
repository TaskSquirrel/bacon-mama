import React from "react";

export async function noop() {
    // noop
}

export const createChangeEventStateSetter = (
    setter: React.Dispatch<React.SetStateAction<string>>
) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(event.target.value);
};

export const isNumber = (test: string) => {
    try {
        Number(test);

        return true;
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
