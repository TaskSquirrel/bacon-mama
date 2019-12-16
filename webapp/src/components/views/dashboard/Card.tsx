import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Popup } from "semantic-ui-react";
import classNames from "classnames";

import Stack from "../../shared/Stack";
import ButtonBase from "../../controls/ButtonBase";
import AuraButton from "../../controls/AuraButton";

import styles from "./Card.module.scss";

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
    name: string;
    description?: string;
    id: string;
    role?: "student" | "professor";
    status?: "complete" | "incomplete";
    onButtonClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    className,
    name,
    description,
    id,
    role,
    status,
    onButtonClick,
}) => {
    const [hovering, setHovering] = useState<boolean>(false);

    const isStudent = role === "student";

    const click = () => onButtonClick && onButtonClick();

    const createHoveringSetter = (state: boolean) => () => {
        if (isStudent) {
            return;
        }

        setHovering(state);
    };

    const renderCompleted = () => {
        if (!isStudent) {
            return null;
        }

        const icon = status === "complete"
            ? "fas fa-check-circle"
            : "fas fa-times-circle";

        return (
            <Popup
                size="mini"
                content={ status === "complete" ? "Done" : "Unfinished" }
                trigger={ (
                    <div
                        className={ classNames(
                            styles.icon,
                            status === "complete" && styles.completed
                        ) }
                    >
                        <i
                            className={ icon }
                        />
                    </div>
                ) }
            />

        );
    };

    const renderButton = () => {
        return (
            <AuraButton
                className={ classNames(
                    styles.button,
                    hovering && styles.hovering
                ) }
                onClick={ click }
            >
                <i className="fas fa-times" />
            </AuraButton>
        );
    };

    return (
        <Stack
            className={ classNames(styles.card, className) }
            onMouseOver={ createHoveringSetter(true) }
            onMouseOut={ createHoveringSetter(false) }
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
                className={ styles.actions }
            >
                <div>
                    { renderCompleted() }
                </div>
                <div
                    className={ styles.edit }
                >
                    <Popup
                        trigger={ (
                            <Link to={ `/edit/${id}` }>
                                <ButtonBase inverted clear className={ styles.pen }>
                                    <i className="fas fa-pen" />
                                </ButtonBase>
                            </Link>
                        ) }
                        size="mini"
                        content="Edit"
                    />
                    <Popup
                        className={ styles.popup }
                        trigger={ (
                            <Link to={ `/play/${id}` }>
                                <ButtonBase inverted clear className={ styles.play }>
                                    <i className="fas fa-play" />
                                </ButtonBase>
                            </Link>
                        ) }
                        size="mini"
                        content="Play"
                    />

                </div>
            </div>
            { !isStudent && renderButton() }
        </Stack>
    );
};

export default Card;
