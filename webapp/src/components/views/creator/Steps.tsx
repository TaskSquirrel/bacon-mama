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
            setEditStepModal
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

    const renderActions = () => {
        return (
            <div
                className={ styles.actions }
            >
                <button
                    onClick={ openEditStepModal }
                >
                    Edit
                </button>
            </div>
        );
    };

    const renderSteps = () => steps
        .sort(({ sequence: a }, { sequence: b }) => a - b)
        .map(({
            name, description, sequence, verb
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
                                { verb || "Untitled" }
                            </div>
                            <div
                                className={ styles.description }
                            >
                                { description || "No description" }
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
        <div
            className={ styles.container }
        >
            <h1
                className={ styles.heading }
            >
                Steps
            </h1>
            <ol
                className={ styles.list }
            >
                { renderSteps() }
            </ol>
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

export default Steps;
