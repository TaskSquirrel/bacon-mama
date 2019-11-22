import React, { SetStateAction, Dispatch } from "react";
import classNames from "classnames";

import styles from "./NavBar.module.scss";
import ButtonBase from "./ButtonBase";
import UserCircle from "./UserCircle";

export interface NavBarProps extends React.HTMLProps<HTMLDivElement> {
    className?: string;
    userName?: string;
    click: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
    children,
    className,
    userName,
    click,
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
            <ButtonBase onClick={click} className={styles.button}>
                <a>
                    Create a Recipe
                </a>
            </ButtonBase>
            <UserCircle userName={userName} />
        </div>
    );
};

export default NavBar;
