import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import classNames from "classnames";

import { ContentCreatorContext } from "./ContentCreatorProvider";

import styles from "./Steps.module.scss";

const Steps: React.FC = () => {
    const {
        steps,
        metadata: { id: recipeID },
        actions: {
            openEditStep
        }
    } = useContext(ContentCreatorContext);
    const { push } = useHistory();
    const { sequence: sequenceParam } = useParams();

    const renderActions = () => {
        return (
            <div
                className={ styles.actions }
            >
                <button
                    onClick={ openEditStep }
                >
                    Edit
                </button>
            </div>
        );
    };

    const renderSteps = () => steps
        .sort(({ sequence: a }, { sequence: b }) => a - b)
        .map(({
            name, description, sequence
        }) => {
            const isActive = `${sequence}` === sequenceParam;
            const onStepClick = () => {
                push(`/edit/${recipeID}/${sequence}`);
            };

            return (
                <li
                    key={ sequence }
                    role="button"
                    className={ classNames(
                        styles.step,
                        isActive && styles.active
                    ) }
                    onClick={ onStepClick }
                >
                    <div
                        className={ styles.metadata }
                    >
                        <div
                            className={ styles.sequence }
                        >
                            <div
                                className={ styles.number }
                            >
                                { sequence + 1 }
                            </div>
                        </div>
                        <div
                            className={ styles.details }
                        >
                            <div
                                className={ styles.title }
                            >
                                { name }
                            </div>
                            <div
                                className={ styles.description }
                            >
                                { description }
                            </div>
                        </div>
                    </div>
                    { isActive && renderActions() }
                </li>
            );
        });

    if (steps.length === 0) {
        return (
            <div
                className={ styles.empty }
            >
                No steps!
            </div>
        );
    }

    return (
        <ol
            className={ styles.list }
        >
            { renderSteps() }
        </ol>
    );
};

export default Steps;
