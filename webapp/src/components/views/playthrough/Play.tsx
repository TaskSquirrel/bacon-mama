import React, { useState, useEffect } from "react";

import { Item } from "../../../models/recipe";

import ItemSelector from "./ItemSelector";
import ButtonBase from "../../controls/ButtonBase";
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

    const renderInstructions = () => {
        return (
            <div
                className={ styles.guide }
            >
                <h1
                    className={ styles.title }
                >
                    How to complete this recipe
                </h1>
                <ol
                    className={ styles.list }
                >
                    <li>
                        One item is created at each step using ingredients listed to the left
                    </li>
                    <li>
                        At each step, several items are presented randomly and it's your job to
                        correctly allocate the proper amounts!
                    </li>
                    <li>
                        Be careful, though. Adding more than you need or adding the wrong
                        ingredients will leave you with error marks!
                    </li>
                </ol>
                <div>
                    <ButtonBase
                        className={ styles.start }
                        onClick={ nextStep }
                    >
                        Start!
                    </ButtonBase>
                </div>
            </div>
        );
    };

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
            { !currentStep && renderInstructions() }
            { currentStep && renderFeedback() }
            { currentStep && (
                <ItemSelector
                    items={ shownItems }
                />
            ) }
        </div>
    );
};

export default Play;
