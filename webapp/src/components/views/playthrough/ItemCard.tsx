import React from "react";

import styles from "./ItemCard.module.scss";

interface ItemCardProps {
    title: string;
    amount?: number | string;
}

const ItemCard: React.FC<ItemCardProps> = ({
    title,
    amount,
}) => {
    return (
        <div
            className={ styles.card }
        >
            <div
                className={ styles.title }
            >
                { title }
            </div>
            <div
                className={ styles.amount }
            >
                { amount }
            </div>
        </div>
    );
};

export default ItemCard;
