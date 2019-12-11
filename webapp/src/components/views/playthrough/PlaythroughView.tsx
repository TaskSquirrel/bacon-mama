import React from "react";

import DelayedIndicator from "../../shared/DelayedIndicator";
import Sidebar from "./Sidebar";
import Play from "./Play";

import usePlaythrough from "./usePlaythrough";

import styles from "./PlaythroughView.module.scss";

const PlaythroughView: React.FC = () => {
    const { error, recipe } = usePlaythrough();

    if (error) {
        return (
            <div>
                Error loading recipe
            </div>
        );
    }

    if (!recipe) {
        return (
            <DelayedIndicator />
        );
    }

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
