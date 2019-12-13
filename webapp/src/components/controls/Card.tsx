import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import Stack from "../shared/Stack";

import styles from "./Card.module.scss";
import ButtonBase from "./ButtonBase";

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
                    <ButtonBase
                        inverted
                        clear
                        className={ styles.pen }
                    >
                        <i
                            className="fas fa-pen"
                        />
                    </ButtonBase>
                </Link>
                <Link
                    to={ `/play/${id}` }
                >
                    <ButtonBase
                        inverted
                        clear
                        className={ styles.play }
                    >
                        <i
                            className="fas fa-play"
                        />
                    </ButtonBase>
                </Link>
            </div>
        </Stack>
    );
};

export default Card;
