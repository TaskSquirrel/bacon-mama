import React from "react";
import classNames from "classnames";

import styles from "./ItemPickerModal.module.scss";

interface ItemPickerItemProps {
    selected: boolean;
    image?: string;
    name: string;
    onClick: () => void;
}

const ItemPickerItem: React.FC<ItemPickerItemProps> = ({
    selected,
    image,
    name,
    onClick,
}) => {
    return (
        <div
            className={ classNames(
                styles.item,
                selected && styles.selected
            ) }
            onClick={ onClick }
        >
            <div
                className={ styles.image }
            >
                { image && (
                    <img
                        alt={ name }
                        src={ image }
                    />
                ) }
            </div>
            <div>
                { name }
            </div>
        </div>
    );
};

export default ItemPickerItem;
