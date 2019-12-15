import React from "react";
import classNames from "classnames";

import { Item } from "../../../models/recipe";

import AmountChooser from "./AmountChooser";
import usePlaythrough from "./usePlaythrough";

import { getImageURL } from "../../../utils";

import styles from "./Play.module.scss";

interface ItemSelectorProps {
    items: Item[];
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
    items,
}) => {
    const {
        selected: selectedItem,
        currentStep,
        stepDone,
        select,
        replace,
    } = usePlaythrough();

    const createItemSelector = (item: string | null) => () => select(item);

    if (!currentStep) {
        return null;
    }

    const getCurrentItemRequiredAmount = () => {
        if (!selectedItem) {
            return null;
        }

        const state = currentStep.dependencies
            .find(({ item: { id } }) => selectedItem.id === id);

        if (!state) {
            return null;
        }

        return state.amount;
    };

    const replacer = (amount: number) => {
        if (!selectedItem) {
            return;
        }

        replace(selectedItem.id, amount);
    };

    const renderUserInstructions = () => {
        let text = "Go to the next step!";

        if (currentStep && currentStep.description) {
            text = currentStep.description;
        }

        return (
            <div
                className={ styles.center }
            >
                { text }
            </div>
        );
    };

    const renderItem = ({ id, name, image, description }: Item) => {
        const selected = selectedItem
            ? selectedItem.id === id
            : false;

        return (
            <div
                key={ id }
                className={ classNames(
                    styles.item,
                    selected && styles.selected,
                    stepDone && styles.done
                ) }
                onClick={ createItemSelector(id) }
            >
                <div
                    className={ styles.image }
                >
                    { image && (
                        <img
                            alt={ name }
                            src={ getImageURL(image) }
                        />
                    ) }
                </div>
                <div
                    className={ styles.info }
                >
                    <div
                        className={ styles.title }
                    >
                        { name }
                    </div>
                    <div
                        className={ styles.description }
                    >
                        { description }
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className={ styles.selector }
        >
            <div
                className={ styles.items }
            >
                { currentStep.dependencies.length > 0
                    ? items.map(renderItem)
                    : renderUserInstructions() }
            </div>
            <AmountChooser
                amountRequired={ getCurrentItemRequiredAmount() || undefined }
                replace={ replacer }
            />
        </div>
    );
};

export default ItemSelector;
