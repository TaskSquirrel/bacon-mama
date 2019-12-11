import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import Stack from "../shared/Stack";

import styles from "./Card.module.scss";

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
    name: string;
    description?: string;
    id: string;
}

const Card: React.FC<CardProps> = ({
    className,
    name,
    description,
    id
}) => {
    return (
        <Stack
            className={ classNames(
                styles.card,
                className
            ) }
        >
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
            <div
                className={ styles.edit }
            >
                <Link
                    to={ `/edit/${id}` }
                >
                    Edit
                </Link>
                <Link
                    to={ `/play/${id}` }
                >
                    Play
                </Link>
            </div>
        </Stack>
    );
};

export default Card;
