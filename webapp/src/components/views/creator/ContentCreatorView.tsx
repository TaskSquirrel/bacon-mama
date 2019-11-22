import React, { useContext } from "react";

import Steps from "./Steps";
import ItemPicker from "./ItemPicker";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import UtilityBar from "./UtilityBar";

import styles from "./ContentCreatorView.module.scss";
import { Link } from "react-router-dom";

const CreateRecipe: React.FC = () => {
    const {
        error,
        available
    } = useContext(ContentCreatorContext);

    if (!available && !error) {
        return null;
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
        <div
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
        </div>
    );
};

export default CreateRecipe;
