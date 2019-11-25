import React from "react";
import classNames from "classnames";

import styles from "./Responsive.module.scss";

interface ResponsiveProps {
    wider?: boolean;
}

const Responsive: React.FC<ResponsiveProps> = ({
    children,
    wider
}) => {
    return (
        <div
            className={ classNames(
                styles.responsive,
                wider && styles.wider
            ) }
        >
            { children }
        </div>
    );
};

export default Responsive;
