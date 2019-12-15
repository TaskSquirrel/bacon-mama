import React, { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import Stack from "../../shared/Stack";
import ButtonBase from "../../controls/ButtonBase";
import AuraButton from "../../controls/AuraButton";
import ConfirmationModal from "../creator/modals/ConfirmationModal";

import styles from "./Card.module.scss";

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
    name: string;
    description?: string;
    id: string;
    role?: "student" | "professor";
    status?: "complete" | "incomplete";
    remove?: (i: string) => void;
}

const Card: React.FC<CardProps> = ({
    className,
    name,
    description,
    id,
    role,
    status,
    remove,
}) => {
    const [hovering, setHovering] = useState<boolean>(false);
    const [showDeletePrompt, setShowDeletePrompt] = useState<boolean>(false);

    const isStudent = role === "student";

    const createHoveringSetter = (state: boolean) => () => {
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
        );
    };

    const renderDeleteStepConfirmation = () => {
        return (
            <ConfirmationModal
                show={ showDeletePrompt }
                title="Delete recipe?"
                prompt="Are you sure you want to delete this recipe?"
                cancelText="No"
                actionText="Yes"
                onAction={ () => {
                    if (remove && id) { remove(id); }
                    createHoveringSetter(false);
                    setShowDeletePrompt(false);
                } }
            />
        );
    };

    const renderButton = () => {
        if (showDeletePrompt) {
            return;
        }

        return (
            <AuraButton
                className={ classNames(
                    styles.button,
                    hovering && styles.hovering
                ) }
                onClick={ () => {
                    setShowDeletePrompt(true);
                    createHoveringSetter(false);
                } }
            >
                <i className="fas fa-times" />
            </AuraButton>
        );
    };

    return (
        <Stack
            className={ classNames(styles.card, className) }
            onMouseOver={
                role === "professor" && !showDeletePrompt
                    ? createHoveringSetter(true)
                    : () => {}
            }
            onMouseOut={
                role === "professor" && !showDeletePrompt
                    ? createHoveringSetter(false)
                    : () => {}
            }
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
                    <Link to={ `/edit/${id}` }>
                        <ButtonBase inverted clear className={ styles.pen }>
                            <i className="fas fa-pen" />
                        </ButtonBase>
                    </Link>
                    <Link to={ `/play/${id}` }>
                        <ButtonBase inverted clear className={ styles.play }>
                            <i className="fas fa-play" />
                        </ButtonBase>
                    </Link>
                </div>
            </div>
            { renderButton() }
            { renderDeleteStepConfirmation() }
        </Stack>
    );
};

export default Card;
