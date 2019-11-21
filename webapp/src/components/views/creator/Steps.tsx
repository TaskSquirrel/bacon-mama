import React, { useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import classNames from "classnames";

import { ContentCreatorContext } from "./ContentCreatorProvider";

import styles from "./Steps.module.scss";
import IconButton from "../../controls/IconButton";

const Steps: React.FC = () => {
    const {
        currentStep,
        steps,
        metadata: { id: recipeID },
        actions: {
            addStep,
            deleteStep,
            setEditStepModal,
        }
    } = useContext(ContentCreatorContext);
    const { push } = useHistory();
    const { sequence: sequenceParam } = useParams();

    const openEditStepModal = () => setEditStepModal(true);

    const add = () => {
        addStep({
            name: "Untitled step",
            dependencies: [],
            result: null,
            verb: "mix",
            sequence: steps.length
        });
    };

    const createDeleteStep = (id: string) => () => {
        deleteStep(id);
    };

    const renderAddStepAction = () => {
        return (
            <div
                className={ styles.action }
            >
                <button
                    className={ styles.add }
                    onClick={ add }
                >
                    <i
                        className="fas fa-plus"
                    />
                </button>
            </div>
        );
    };

    const renderActions = (stepID: string) => {
        return (
            <div
                className={ styles.actions }
            >
                <IconButton
                    className={ styles.edit }
                    onClick={ openEditStepModal }
                >
                    <i
                        className="fas fa-pen"
                    />
                </IconButton>
                <IconButton
                    className={ styles.up }
                >
                    <i
                        className="fas fa-arrow-up"
                    />
                </IconButton>
                <IconButton>
                    <i
                        className="fas fa-arrow-down"
                    />
                </IconButton>
                <IconButton
                    className={ styles.delete }
                    onClick={ createDeleteStep(stepID) }
                >
                    <i
                        className="fas fa-times"
                    />
                </IconButton>
            </div>
        );
    };

    const renderStepsList = () => steps
        .sort(({ sequence: a }, { sequence: b }) => a - b)
        .map(({
            id, name, description, sequence, verb
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
                        styles.step
                    ) }
                    onClick={ onStepClick }
                >
                    <div
                        className={ classNames(
                            styles.metadata,
                            isActive && styles.active
                        ) }
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
                                { name || (
                                    <i>
                                        Untitled step
                                    </i>
                                ) }
                            </div>
                            <div
                                className={ styles.description }
                            >
                                { description || (
                                    <i>
                                        No description
                                    </i>
                                ) }
                            </div>
                        </div>
                    </div>
                    { isActive && renderActions(id) }
                </li>
            );
        });

    const renderStepsContainer = () => {
        return (
            <div>
                { steps.length > 0 && (
                    <ol
                        className={ styles.list }
                    >
                        { renderStepsList() }
                    </ol>
                ) }
                { renderAddStepAction() }
            </div>
        );
    };

    useEffect(() => {
        const shift = (event: KeyboardEvent) => {
            if (!currentStep) {
                return;
            }

            const { sequence } = currentStep;

            if (event.key === "ArrowUp") {
                const previous = sequence - 1;

                if (previous >= 0) {
                    push(`/edit/${recipeID}/${previous}`);
                }
            } else if (event.key === "ArrowDown") {
                const next = sequence + 1;

                if (next < steps.length) {
                    push(`/edit/${recipeID}/${next}`);
                }
            }
        };

        document.addEventListener("keydown", shift);

        return () => document.removeEventListener("keydown", shift);
    }, [push, recipeID, steps, currentStep]);

    return (
        <div
            className={ styles.container }
        >
            <div
                className={ styles.top }
            >
                <h1
                    className={ styles.heading }
                >
                    Steps
                </h1>
            </div>
            { renderStepsContainer() }
        </div>
    );
};

export default Steps;
