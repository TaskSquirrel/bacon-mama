import React from "react";
import { Link } from "react-router-dom";
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
    return (
        <Responsive
            wider
        >
            <div
                className={classNames(
                    styles.navbar,
                    className
                )}
            >
                <div
                    className={styles.links}
                >
                    <Link
                        to="/dashboard"
                    >
                        Home
                    </Link>
                    {role && role === "professor" && (
                        <Link
                            to="/class"
                        >
                            Class
                            </Link>
                    )}
                    {role && role === "professor" && (
                        <ButtonBase
                            onClick={click}
                            className={styles.button}
                        >
                            Create a Recipe
                        </ButtonBase>
                    )}

                </div>
                <UserCircle
                    userName={userName}
                />
            </div>
        </Responsive>
    );
};

export default NavBar;
