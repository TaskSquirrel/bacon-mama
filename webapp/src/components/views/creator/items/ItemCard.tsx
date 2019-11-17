import React from "react";

import styles from "./ItemCard.module.scss";

export interface ItemCardProps {
    name: string;
    quantity?: {
        amount: number,
        unit: string
    };
}

const ItemCard: React.FC<ItemCardProps> = ({
    name, quantity
}) => {
    const renderDetails = () => {
        return (
            <div
                className={ styles.details }
            >
                <div
                    className={ styles.title }
                >
                    { name }
                </div>
                { quantity && (
                    <div
                        className={ styles.measurement }
                    >
                        { `${quantity.amount} ${quantity.unit}` }
                    </div>
                ) }
            </div>
        );
    };


    return (
        <div
            className={ styles.card }
        >
            <div
                className={ styles.image }
            />
            { renderDetails() }
        </div>
    );
};

export default ItemCard;
