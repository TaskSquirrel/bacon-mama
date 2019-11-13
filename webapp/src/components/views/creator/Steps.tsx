import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import classNames from "classnames";

import ButtonBase from "../../controls/ButtonBase";
import { ContentCreatorContext } from "./ContentCreatorProvider";

import styles from "./Steps.module.scss";

const Steps: React.FC = () => {
    const {
        steps,
        metadata: { id: recipeID },
        actions: {
            addStep,
            openEditStep
        }
    } = useContext(ContentCreatorContext);
    const { push } = useHistory();
    const { sequence: sequenceParam } = useParams();

    const add = () => {
        addStep({
            name: "Untitled step",
            dependencies: [],
            creates: null,
            verb: "mix",
            sequence: steps.length
        });
    };

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
                <ButtonBase
                    onClick={ add }
                >
                    Add step
                </ButtonBase>
            </div>
        );
    }

    return (
        <ol
            className={ styles.list }
        >
            { renderSteps() }
            <li>
                <ButtonBase
                    onClick={ add }
                >
                    Add step
                </ButtonBase>
            </li>
        </ol>
    );
};

export default Steps;
