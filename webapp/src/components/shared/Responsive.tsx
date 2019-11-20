import React from "react";

import styles from "./Responsive.module.scss";

const Responsive: React.FC = ({
    children
}) => {
    return (
        <div
            className={ styles.responsive }
        >
            { children }
        </div>
    );
};

export default Responsive;
