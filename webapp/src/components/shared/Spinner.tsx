import React from "react";
import classNames from "classnames";

import styles from "./Spinner.module.scss";

interface SpinnerProps {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
    return (
        <div
            className={ classNames(
                styles.spinner,
                className
            ) }
        >
            <i
                className="fas fa-spinner"
            />
        </div>
    );
};

export default Spinner;
