import React from "react";
import classNames from "classnames";

import { Item } from "../../../models/recipe";

import AmountChooser from "./AmountChooser";
import usePlaythrough from "./usePlaythrough";

import styles from "./Play.module.scss";

interface ItemSelectorProps {
    items: Item[];
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
    items,
}) => {
    const {
        selected: selectedItem,
        stepDone,
        select,
        replace,
    } = usePlaythrough();

    const createItemSelector = (item: string | null) => () => select(item);

    const replacer = (amount: number) => {
        if (!selectedItem) {
            return;
        }

        replace(selectedItem.id, amount);
    };

    const renderItem = ({ id, name, description }: Item) => {
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
                />
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
                { items.map(renderItem) }
            </div>
            <AmountChooser
                replace={ replacer }
            />
        </div>
    );
};

export default ItemSelector;
