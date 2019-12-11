import React from "react";

import PlaythroughProvider from "./PlaythroughProvider";
import PlaythroughView from "./PlaythroughView";

const Playthrough: React.FC = () => {
    return (
        <PlaythroughProvider>
            <PlaythroughView />
        </PlaythroughProvider>
    );
};

export default Playthrough;
