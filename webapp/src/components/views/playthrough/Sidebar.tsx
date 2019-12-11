import React from "react";
import classNames from "classnames";

import { Dependency } from "../../../models/recipe";

import Stack from "../../shared/Stack";
import ItemCard from "./ItemCard";
import usePlaythrough from "./usePlaythrough";

import styles from "./Sidebar.module.scss";

const Sidebar: React.FC = () => {
    const {
        recipe,
        currentStep,
        itemState,
        errorMarks,
    } = usePlaythrough();

    const centeredGrayClassName = classNames(
        styles.info,
        styles.empty
    );

    const renderStepInfo = () => {
        if (!currentStep) {
            return null;
        }

        const {
            name: stepName,
            description: stepDescription,
            sequence,
        } = currentStep;

        const resolvedStepName = stepName || "Untitled";

        return (
            <div
                className={ styles.step }
            >
                <h2>
                    { `Step ${sequence + 1}: ${resolvedStepName}` }
                </h2>
                { stepDescription && (
                    <div
                        className={ styles.details }
                    >
                        { stepDescription }
                    </div>
                ) }
            </div>
        );
    };

    const renderAddedItems = () => {
        if (!recipe) {
            return null;
        }

        const { items } = recipe;

        return itemState.map(({ id, amount }) => {
            const item = items.find(({ id: itemID }) => itemID === id);

            if (!item) {
                return null;
            }

            return (
                <ItemCard
                    key={ id }
                    title={ item.name }
                    amount={ `${amount}` }
                />
            );
        });
    };

    const renderDependencies = (dependencies: Dependency[]) => {
        return dependencies.map(({ id, item: { name: itemName }, amount, unit }) => (
            <ItemCard
                key={ id }
                title={ itemName }
                amount={ `${amount} ${unit}` }
            />
        ));
    };

    const renderContent = () => {
        if (!currentStep) {
            return (
                <div
                    className={ centeredGrayClassName }
                >
                    Read the instructions and begin!
                </div>
            );
        }

        const { dependencies, result } = currentStep;

        return (
            <div
                className={ styles.step }
            >
                { errorMarks > 0 && (
                    <Stack
                        className={ styles.section }
                    >
                        <div
                            className={ styles.heading }
                        >
                            Error marks
                        </div>
                        <div
                            className={ styles.marks }
                        >
                            { errorMarks }
                        </div>
                    </Stack>
                ) }
                <Stack
                    className={ styles.section }
                >
                    <div
                        className={ styles.heading }
                    >
                        Added items
                    </div>
                    <div>
                        { itemState.length > 0
                            ? renderAddedItems()
                            : (
                                <div
                                    className={ centeredGrayClassName }
                                >
                                    No items added yet!
                                </div>
                            ) }
                    </div>
                </Stack>
                <Stack
                    className={ styles.section }
                >
                    <div
                        className={ styles.heading }
                    >
                        Ingredients in this step
                    </div>
                    <div>
                        { renderDependencies(dependencies) }
                    </div>
                </Stack>
                <Stack>
                    <div
                        className={ styles.heading }
                    >
                        Resulting item
                    </div>
                    <div>
                        { result
                            ? (
                                <ItemCard
                                    title={ result.item.name }
                                    amount={ `${result.amount} ${result.unit}` }
                                    progress={ 0.5 }
                                />
                            )
                            : (
                                <div
                                    className={ centeredGrayClassName }
                                >
                                    This step doesn't result in anything.
                                </div>
                            ) }
                    </div>
                </Stack>
            </div>
        );
    };

    if (!recipe) {
        return null;
    }

    const { name, description } = recipe;

    return (
        <div
            className={ styles.container }
        >
            <div
                className={ styles.recipe }
            >
                <h1
                    className={ styles.title }
                >
                    { name }
                </h1>
                <div
                    className={ styles.description }
                >
                    { description }
                </div>
            </div>
            { renderStepInfo() }
            { renderContent() }
        </div>
    );
};

export default Sidebar;
