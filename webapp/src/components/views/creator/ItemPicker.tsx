import React, { useContext, useState } from "react";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import { Item } from "../../../models/recipe";

import styles from "./ItemPicker.module.scss";

const ItemPicker: React.FC = () => {
    const {
        items,
    } = useContext(ContentCreatorContext);

    const [pickedItem, setItem] = useState<Item[]>([]);

    return (
        <div className={ styles.container }>
            <button className={ styles.add }>
                +
            </button>
            <div className={ styles.items }>
                { pickedItem.map((item) => {
                    return (
                        <div
                            key={ item.name }
                            className={ styles.item }
                        >
                            { item.name }
                        </div>
                    );
                }) }
            </div>
        </div>
    );
};

export default ItemPicker;
