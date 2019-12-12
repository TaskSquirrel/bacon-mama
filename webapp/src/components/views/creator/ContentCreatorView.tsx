import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Steps from "./Steps";
import ItemPicker from "./ItemPicker";

import DelayedIndicator from "../../shared/DelayedIndicator";
import { ContentCreatorContext } from "./ContentCreatorProvider";
import UtilityBar from "./UtilityBar";

import styles from "./ContentCreatorView.module.scss";

const CreateRecipe: React.FC = () => {
    const {
        error,
        available,
    } = useContext(ContentCreatorContext);

    if (!available && !error) {
        return (
            <DelayedIndicator />
        );
    }

    if (!available) {
        return (
            <DelayedIndicator />
        );
    }

    if (error) {
        return (
            <div
                className={ styles.error }
            >
                <div>
                    Recipe not found!
                </div>
                <div>
                    <Link
                        to="/"
                    >
                        Go back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main
            className={ styles.container }
        >
            <div
                className={ styles.left }
            >
                <Steps />
            </div>
            <div
                className={ styles.content }
            >
                <div
                    className={ styles.top }
                >
                    <UtilityBar />
                </div>
                <div
                    className={ styles.center }
                >
                    <ItemPicker />
                </div>
            </div>
        </main>
    );
};

export default CreateRecipe;
