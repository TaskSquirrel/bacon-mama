import React, { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import styles from "./ClassCard.module.scss";

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
    name?: string;
    description?: string;
    id?: string;
    click: () => void;
}

const ClassCard: React.FC<CardProps> = ({
    className,
    name,
    description,
    id,
    click
}) => {
    
    const [color, setColor]  = useState<String>("white");

    return (
        <div
            className={classNames(
                styles.card,
                className
            )}
            style={{backgroundColor: `${color}`}}
            onClick={ ()  => {
                click();
                setColor("lightblue");
            }}
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
