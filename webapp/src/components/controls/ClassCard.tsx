import React from "react";
import classNames from "classnames";

import styles from "./ClassCard.module.scss";

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
    name?: string;
    description?: string;
    index?: number;
    add?: () => void;
    click?: (i: number) => void;
    color?: string;
}

const ClassCard: React.FC<CardProps> = ({
    className,
    name,
    description,
    index,
    click,
    add,
    color
}) => {
    return (
        <div
            className={ classNames(
                styles.card,
                className
            ) }
            style={ { backgroundColor: color } }
            onClick={ name ? () => { if (click && index != null) click(index) } : add }
        >
            { name ? (
                <div>
                    <div
                        className={ styles.name }
                    >
                        { name }
                    </div>
                    <div
                        className={ styles.description }
                    >
                        { description }
                    </div>
                </div>
            ) : "+" }
        </div>
    );
};

export default ClassCard;
