import React from "react";

import styles from "./ItemCard.module.scss";

interface ItemCardProps {
    title: string;
    amount?: number | string;
    progress?: number;
}

const ItemCard: React.FC<ItemCardProps> = ({
    title,
    amount,
    progress,
}) => {
    let pct;

    if (!progress) {
        pct = 0;
    } else {
        pct = progress;
    }

    return (
        <div
            className={ styles.card }
        >
            <div
                className={ styles.details }
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
            <div
                className={ styles.progress }
                style={ {
                    width: `${pct * 100}%`
                } }
            />
        </div>
    );
};

export default ItemCard;
