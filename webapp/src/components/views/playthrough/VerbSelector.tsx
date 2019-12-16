import React from "react";

import usePlaythrough from "./usePlaythrough";

import styles from "./VerbSelector.module.scss";

const VerbSelector: React.FC = () => {
    const { currentStep } = usePlaythrough();

    if (!currentStep) {
        return null;
    }

    return (
        <div
            className={ styles.container }
        >
            { currentStep.verb }
        </div>
    );
};

export default VerbSelector;
