import React from "react";
import classNames from "classnames";

import styles from "./Card.module.scss";
import { Link } from 'react-router-dom';

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
    name: string,
    description?: string,
    id: string
}

const Card: React.FC<CardProps> = ({
    className,
    name,
    description,
    id
}) => {
    return (
        <div
            className={classNames(
                styles.card,
                className
            )}
        >
            <div className={styles.name}>
                {name}
            </div>
            <div className={styles.description}>
                {description}
            </div>

            <div className={styles.edit}>
                <Link
                    to={`/edit/${id}`}
                >
                    Edit
                </Link>
            </div>
        </div>
    );
};

export default Card;
