import React from "react";

import styles from "./CenteredPane.module.scss";

const Centered: React.FC = ({ children }) => {
    return (
        <div
            className={ styles.centered }
        >
            <div
                className={ styles.pane }
            >

                { children }
            </div>
        </div>
    );
};

export default Centered;
