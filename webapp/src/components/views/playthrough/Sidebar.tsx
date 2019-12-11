import React from "react";

import { Dependency } from "../../../models/recipe";

import usePlaythrough from "./usePlaythrough";

import styles from "./Sidebar.module.scss";

const Sidebar: React.FC = () => {
    const {
        recipe,
        currentStep,
        itemState,
        errorMarks,
    } = usePlaythrough();

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
                <div
                    key={ `${id}-${amount}` }
                    className={ styles.added }
                >
                    <span>
                        { item.name }
                    </span>
                    <span>
                        { amount }
                    </span>
                </div>
            );
        });
    };

    const renderDependencies = (dependencies: Dependency[]) => {
        return dependencies.map(({ item: { id, name } }) => (
            <div
                key={ id }
            >
                { name }
            </div>
        ));
    };

    const renderContent = () => {
        if (!currentStep) {
            return (
                <div>
                    No step!
                </div>
            );
        }

        const { dependencies } = currentStep;

        return (
            <div>
                <div>
                    { renderAddedItems() }
                </div>
                <div>
                    { renderDependencies(dependencies) }
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1>
                Play
            </h1>
            <div>
                { errorMarks > 0 && errorMarks }
            </div>
            <div>
                { renderContent() }
            </div>
        </div>
    );
};

export default Sidebar;
