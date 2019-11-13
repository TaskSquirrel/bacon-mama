import React from "react";

export async function noop() {
    // noop
}

export const createChangeEventStateSetter =(
    setter: React.Dispatch<React.SetStateAction<string>>
) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(event.target.value);
};
