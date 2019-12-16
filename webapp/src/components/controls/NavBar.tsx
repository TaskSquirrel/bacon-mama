import React from "react";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";

import Responsive from "../shared/Responsive";
import ButtonBase from "./ButtonBase";
import UserCircle from "./UserCircle";

import styles from "./NavBar.module.scss";

export interface NavBarProps extends React.HTMLProps<HTMLDivElement> {
    className?: string;
    userName?: string;
    click: () => void;
    role: string | undefined;
}

const NavBar: React.FC<NavBarProps> = ({
    className,
    userName,
    click,
    role
}) => {
    const { push } = useHistory();

    const goHome = () => push("/");

    return (
        <Responsive>
            <div
                className={ classNames(
                    styles.navbar,
                    className
                ) }
            >
                <div
                    className={ styles.image }
                    onClick={ goHome }
                >
                    <img
                        alt="Baking Mama"
                        src="/assets/mama.png"
                        className={ styles.logo }
                    />
                </div>
                <div
                    className={ styles.right }
                >
                    <div
                        className={ styles.links }
                    >
                        <Link
                            to="/dashboard"
                        >
                            Home
                        </Link>
                        { role && role === "professor" && (
                            <Link
                                to="/class"
                            >
                                Class
                            </Link>
                        ) }
                        { role && role === "professor" && (
                            <ButtonBase
                                onClick={ click }
                                className={ styles.button }
                            >
                                Create a Recipe
                            </ButtonBase>
                        ) }

                    </div>
                    <UserCircle
                        userName={ userName }
                    />
                </div>
            </div>
        </Responsive>
    );
};

export default NavBar;
