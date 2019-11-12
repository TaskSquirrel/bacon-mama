import React, { useContext } from "react";

import { ContentCreatorContext } from "./ContentCreatorProvider";

import styles from "./Steps.module.scss";

const Steps: React.FC = () => {
    const {
        steps,
    } = useContext(ContentCreatorContext);

    const renderSteps = () => steps
        .sort(({ sequence: a }, { sequence: b }) => a - b)
        .map(({
            name, description, sequence
        }) => {});

    if (steps.length === 0) {
        return (
            <div>
                No steps!
            </div>
        );
    }

    return (
        <ol>
            {}
        </ol>
    );
};

export default Steps;
