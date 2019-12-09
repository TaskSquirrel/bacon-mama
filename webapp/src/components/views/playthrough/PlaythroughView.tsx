import React from "react";

import Sidebar from "./Sidebar";
import Play from "./Play";

import usePlaythrough from "./usePlaythrough";

import styles from "./PlaythroughView.module.scss";

const PlaythroughView: React.FC = () => {
    const {} = usePlaythrough();

    return (
        <main
            className={ styles.container }
        >
            <div
                className={ styles.left }
            >
                <Sidebar />
            </div>
            <div
                className={ styles.right }
            >
                <Play />
            </div>
        </main>
    );
};

export default PlaythroughView;
