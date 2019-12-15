import React, { useState } from "react";
import classNames from "classnames";

import styles from "./ClassCard.module.scss";
import AuraButton from "./AuraButton";

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
    name?: string;
    description?: string;
    add?: () => void;
    remove?: (userName: string) => void;
}

const StudentCard: React.FC<CardProps> = ({
    className,
    name,
    description,
    add,
    remove
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
                onClick={() => {if(name && remove) remove(name)}}
                
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
            onMouseOver={createHoveringSetter(true)}
            onMouseOut={createHoveringSetter(false)}
            onClick={ name ? () => { } : add }
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
                    {renderButton()}
                </div>
            ) : "+" }
        </div>
    );
};

export default StudentCard;
