import React, { useState } from "react";
import classNames from "classnames";

import styles from "./UserCircle.module.scss";

export interface UserCircleProps extends React.HTMLProps<HTMLDivElement> {
    className?: string;
    userName?: string;
}

const UserCircle: React.FC<UserCircleProps> = ({
    className,
    userName
}) => {
    const [menu, setMenu] = useState<boolean>(false); 

    return (
        <div onClick={() => setMenu(!menu)}>
            <div
                className={ classNames(
                    styles.circle,
                    className
                ) }

                
            >
                {userName ? userName.substring(0,1) : '?'}
            </div>
            {menu ? (
                <div className={styles.menu}>
                    <div>a</div>
                    <div>b</div>
                    <div>c</div>    
                </div>
            ) : ('')}
        </div>
    );
};

export default UserCircle;
