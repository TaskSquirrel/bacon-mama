import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import styles from "./ClassCard.module.scss";
import { APIClassList } from './../../models/API';

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
    name?: string;
    description?: string;
    id?: string;
    add?: () => void;
    click?: (classes:APIClassList | null) => void;
}

const ClassCard: React.FC<CardProps> = ({
    className,
    name,
    description,
    id,
    click,
    add
}) => {

    const classes: APIClassList | null = name ? {id:1, students:["a","b"],name:"dd", recipes:[{id:1,recipeName:"hi"}]} : null;

    return (
        <div
            className={classNames(
                styles.card,
                className
            )}
            onClick={name ? () => {if(click) click(classes)} : add}
        >
            {name ? (
                <div>
                    <div
                        className={styles.name}
                    >
                        {name}
                    </div>
                    <div
                        className={styles.description}
                    >
                        {description}
                    </div>
                </div>
            ) : "+"}

        </div>
    );
};

export default ClassCard;
