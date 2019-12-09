import React from "react";

export interface PlaythroughContextShape {
}

export const PlaythroughContextDefaultShape: PlaythroughContextShape = {};

export const PlaythroughContext = React.createContext<PlaythroughContextShape>(
    PlaythroughContextDefaultShape
);

const PlaythroughProvider: React.FC = ({ children }) => {
    const value: PlaythroughContextShape = {
    };

    return (
        <PlaythroughContext.Provider
            value={ value }
        >
            { children }
        </PlaythroughContext.Provider>
    );
};

export default PlaythroughProvider;
