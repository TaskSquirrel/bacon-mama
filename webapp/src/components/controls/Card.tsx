import React from "react";
import classNames from "classnames";

import styles from "./Card.module.scss";

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
    name: string,
    description?:string
}

const Card: React.FC<CardProps> = ({
    className,
    name,
    description
}) => {
    return (
        <div
            className={ classNames(
                styles.button,
                className
            ) }
        >
            {name}

            {description}
        </div>
    );
};

export default Card;
