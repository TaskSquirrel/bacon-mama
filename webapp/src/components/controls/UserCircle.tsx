import React from "react";
import classNames from "classnames";

import styles from "./UserCircle.module.scss";

export interface UserCircleProps extends React.HTMLProps<HTMLDivElement> {
    className?: string;
    userName?: string;
}

const UserCircle: React.FC<UserCircleProps> = ({
    children,
    className,
    userName
}) => {
    return (
        <div
            className={ classNames(
                styles.circle,
                className
            ) }
        >
            {userName ? userName.substring(0,1) : '?'}
        </div>
    );
};

export default UserCircle;
