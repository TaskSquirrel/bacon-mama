import React, { useContext } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import classNames from "classnames";

import { Step } from "../../../models/recipe";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import AuraButton from "../../controls/AuraButton";
import ItemCard from "./items/ItemCard";

import styles from "./ItemPicker.module.scss";

const ItemPicker: React.FC = () => {
    const {
        metadata: {
            id: recipeID
        },
        currentStep: step,
        actions: {
            replaceStep,
            setEditStepModal
        }
    } = useContext(ContentCreatorContext);
    const { push } = useHistory();
    const { sequence } = useParams();

    const openEditStepModal = () => setEditStepModal(true);

    const openDependencyPicker = () => {
        push(`/edit/${recipeID}/${sequence}/deps`);
    };

    const openResultPicker = () => {
        push(`/edit/${recipeID}/${sequence}/creates`);
    };

    const createOnItemCloseClick = (
        type: "dependency" | "result",
        dependencyID: string,
    ) => () => {
        if (!step) {
            return;
        }

        const { dependencies } = step;

        if (type === "dependency") {
            replaceStep({
                ...step,
                dependencies: dependencies
                    .filter(({ id }) => id !== dependencyID)
            });
        } else if (type === "result") {
            replaceStep({
                ...step,
                result: null
            });
        }
    };

    const renderItems = (currentStep: Step) => {
        const { dependencies } = currentStep;

        return dependencies.map((
            {
                id: dependencyID,
                item: {
                    id,
                    name
                },
                amount,
                unit
            },
            index
        ) => {
            return (
                <ItemCard
                    showButton
                    key={ `${id}-${index}` }
                    name={ name }
                    quantity={ {
                        amount, unit
                    } }
                    onCloseClick={ createOnItemCloseClick(
                        "dependency",
                        dependencyID
                    ) }
                />
            );
        });
    };

    const renderResult = (currentStep: Step) => {
        const { result } = currentStep;

        if (!result) {
            return (
                <AuraButton
                    shadow
                    size="large"
                    className={ styles.button }
                    onClick={ openResultPicker }
                >
                    <i
                        className="fas fa-plus"
                    />
                </AuraButton>
            );
        }

        const {
            id: dependencyID,
            item: { name },
            amount,
            unit
        } = result;

        return (
            <ItemCard
                showButton
                name={ name }
                quantity={ { amount, unit } }
                onCloseClick={ createOnItemCloseClick(
                    "result", dependencyID
                ) }
            />
        );
    };

    if (!step) {
        return (
            <div
                className={ styles.empty }
            >
                Choose a step on the left to edit!
            </div>
        );
    }

    return (
        <div
            className={ styles.container }
        >
            <div
                className={ classNames(
                    styles.scroller,
                    step.dependencies.length <= 2 && styles.center
                ) }
            >
                <div
                    className={ styles.dependencies }
                >
                    { renderItems(step) }
                    <div
                        className={ styles["add-container"] }
                    >
                        <AuraButton
                            size="large"
                            className={ styles.button }
                            onClick={ openDependencyPicker }
                        >
                            <i
                                className="fas fa-plus"
                            />
                        </AuraButton>
                    </div>
                </div>
            </div>
            <div
                className={ styles.divider }
                onClick={ openEditStepModal }
            >
                <span>
                    { step.verb || (
                        <i>
                            No action
                        </i>
                    ) }
                </span>
            </div>
            <div
                className={ classNames(
                    styles.scroller,
                    styles.center
                ) }
            >
                { renderResult(step) }
            </div>
        </div>
    );
};

export default ItemPicker;
