import React from "react";
import { Link } from "react-router-dom";

import styles from "./NotFound.module.scss";

const NotFound: React.FC = () => {
    return (
        <div
            className={ styles.container }
        >
            <h1>
                Page not found!
            </h1>
            <div>
                Hey, you're at the wrong place!
            </div>
            <div>
                <Link
                    to="/"
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
