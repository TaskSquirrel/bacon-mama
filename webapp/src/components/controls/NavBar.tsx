import React from "react";
import classNames from "classnames";

import styles from "./NavBar.module.scss";
import ButtonBase from "./ButtonBase";
import UserCircle from "./UserCircle";

export interface NavBarProps extends React.HTMLProps<HTMLDivElement> {
    className?: string;
    userName?: string;
}

const NavBar: React.FC<NavBarProps> = ({
    children,
    className,
    userName,
}) => {
    return (
        <div
            className={ classNames(
                styles.navbar,
                className
            ) }
        >
            <a href="/dashboard">Home</a>
            <a href="/recipe">Recipe</a>
            <a href="/baking">Baking</a>
            <ButtonBase className={styles.button}>
                <a href="/createRec">
                    Create a Recipe
                </a>
            </ButtonBase>
            <UserCircle userName={userName} />
        </div>
    );
};

export default NavBar;
