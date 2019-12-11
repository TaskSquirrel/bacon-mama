import React, { useState } from "react";
import classNames from "classnames";

import styles from "./UserCircle.module.scss";
import { Link } from "react-router-dom";

export interface UserCircleProps extends React.HTMLProps<HTMLDivElement> {
    className?: string;
    userName?: string;
}

const UserCircle: React.FC<UserCircleProps> = ({ className, userName }) => {
    const [menu, setMenu] = useState<boolean>(false);

    return (
        <div>
            <div
                className={ classNames(styles.circle, className) }
                onClick={ () => setMenu(!menu) }
            >
                { userName ? userName.substring(0, 1) : "?" }
            </div>
            { menu ? (
                <div className={ styles.menu }>
                    <div>
                        <Link
                            to="/sign-out"
                        >
                            Sign out
                        </Link>
                    </div>
                </div>
            ) : "" }
        </div>
    );
};

export default UserCircle;
