import React, { useState } from "react";
import classNames from "classnames";

import styles from "./ClassCard.module.scss";
import AuraButton from "./AuraButton";

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
    name?: string;
    description?: string;
    index?: number;
    add?: () => void;
    click?: (i: number) => void;
    color?: string;
    remove?: (i: number) => void;
    classid?: number ;
}

const ClassCard: React.FC<CardProps> = ({
    className,
    name,
    description,
    index,
    click,
    add,
    remove,
    color,
    classid
}) => {
    const [hovering, setHovering] = useState<boolean>(false);

    const createHoveringSetter = (state: boolean) => () => {
        setHovering(state);
    };

    const renderButton = () => {
        return (
            <AuraButton
                className={ classNames(
                    styles.button,
                    hovering && styles.hovering
                ) }
                onClick={ () => {if (remove && classid) { remove(classid) }} }
            >
                <i
                    className="fas fa-times"
                />
            </AuraButton>
        );
    };

    return (
        <div
            className={ classNames(
                styles.card,
                className
            ) }
            onMouseOver={ createHoveringSetter(true) }
            onMouseOut={ createHoveringSetter(false) }
            style={ { backgroundColor: color } }
            onClick={ name ? () => { if (click && index != null) { click(index) } } : add }
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
                    { renderButton() }
                </div>
            )
            : (
                <div
                    className={ styles.name }
                >
                    +
                </div>
            ) }
        </div>
    );
};

export default ClassCard;
