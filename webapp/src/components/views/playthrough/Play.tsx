import React, { useState, useEffect } from "react";

import { Item } from "../../../models/recipe";

import ItemSelector from "./ItemSelector";
import usePlaythrough from "./usePlaythrough";

import { shuffle } from "../../../utils";

import styles from "./Play.module.scss";

const Play: React.FC = () => {
    const [shownItems, setShownItems] = useState<Item[]>([]);
    const {
        recipe,
        currentStep,
        selected,
        nextStep,
    } = usePlaythrough();

    const renderFeedback = () => {
        let mainText;

        if (!selected) {
            mainText = "Select an item!";
        } else {
            mainText = `Selected ${selected.name}...`;
        }

        return (
            <div>
                <h1>
                    { mainText }
                </h1>
            </div>
        );
    };

    useEffect(() => {
        if (!recipe) {
            return;
        }

        if (!currentStep) {
            setShownItems([]);
        } else {
            setShownItems(shuffle(recipe.items));
        }
    }, [currentStep]);

    if (!recipe) {
        // Never reached
        // Recipe is always set.

        return null;
    }

    return (
        <div
            className={ styles.container }
        >
            <button
                onClick={ nextStep }
            >
                Next
            </button>
            { renderFeedback() }
            { currentStep && (
                <ItemSelector
                    items={ shownItems }
                />
            ) }
        </div>
    );
};

export default Play;
