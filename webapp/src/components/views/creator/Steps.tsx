import React, { useState, useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import classNames from "classnames";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import IconButton from "../../controls/IconButton";
import ConfirmationModal from "./modals/ConfirmationModal";

import styles from "./Steps.module.scss";
import useUser from "../../hooks/useUser";

interface DeleteStepPromptState {
    show: boolean;
    step: string | null;
}

const Steps: React.FC = () => {
    const {
        currentStep,
        steps,
        metadata: { id: recipeID },
        actions: {
            addStep,
            replaceStep,
            deleteStep,
            setEditStepModal,
        }
    } = useContext(ContentCreatorContext);
    const { push } = useHistory();
    const { role } = useUser();
    const { sequence: sequenceParam } = useParams();
    const [showDeletePrompt, setShowDeletePrompt] = useState<
        DeleteStepPromptState
    >({ show: false, step: null });

    const isStudent = role === "student";

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

    const createMoveStep = (id: string, sequence: number) => () => {
        const step = steps
            .find(({ id: stepID }) => stepID === id);

        if (!step) {
            return;
        }

        replaceStep({
            ...step,
            sequence
        });
    };

    const createDeleteStep = (id: string | null) => (action: boolean) => {
        if (!id) {
            return;
        }

        if (action) {
            deleteStep(id);
        }

        setShowDeletePrompt({ show: false, step: null });
    };

    const createDeleteStepPromptStateChange = (
        state: boolean, id: string
    ) => () => {
        setShowDeletePrompt({ show: state, step: id });
    };

    const renderDeleteStepConfirmation = () => {
        return (
            <ConfirmationModal
                show={ showDeletePrompt.show }
                title="Delete step?"
                prompt="Are you sure you want to delete this step?"
                cancelText="No"
                actionText="Yes"
                onAction={ createDeleteStep(showDeletePrompt.step) }
            />
        );
    };

    const renderAddStepAction = () => {
        if (isStudent) {
            return;
        }

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

    const renderActions = (stepID: string, sequence: number) => {
        if (isStudent) {
            return;
        }

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
                    onClick={ createMoveStep(stepID, sequence - 1) }
                >
                    <i
                        className="fas fa-arrow-up"
                    />
                </IconButton>
                <IconButton
                    onClick={ createMoveStep(stepID, sequence + 1) }
                >
                    <i
                        className="fas fa-arrow-down"
                    />
                </IconButton>
                <IconButton
                    className={ styles.delete }
                    onClick={ createDeleteStepPromptStateChange(
                        true, stepID
                    ) }
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
            id, name, description, sequence
        }) => {
            const isActive = `${sequence}` === sequenceParam;
            const incomplete = !name || !description;
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
                                className={ classNames(
                                    styles.title,
                                    isActive && styles.active
                                ) }
                            >
                                { name || (
                                    <i>
                                        Untitled step
                                    </i>
                                ) }
                            </div>
                            { isActive && (
                                <div
                                    className={ styles.description }
                                >
                                    { description || (
                                        <i>
                                            No description
                                        </i>
                                    ) }
                                </div>
                            ) }
                        </div>
                        { !isActive && incomplete && !isStudent && (
                            <div
                                className={ styles.caution }
                            >
                                <i
                                    className="fas fa-exclamation-triangle"
                                />
                            </div>
                        ) }
                    </div>
                    { isActive && renderActions(id, sequence) }
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
            { renderDeleteStepConfirmation() }
        </div>
    );
};

export default Steps;
