import React, { useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import classNames from "classnames";

import { Step } from "../../../models/recipe";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import AuraButton from "../../controls/AuraButton";
import ItemCard from "./items/ItemCard";
import useUser from "../../hooks/useUser";

import { getImageURL } from "../../../utils";

import styles from "./ItemPicker.module.scss";

const ItemPicker: React.FC = () => {
    const {
        metadata: {
            id: recipeID
        },
        items,
        currentStep: step,
        actions: {
            replaceStep,
            setEditStepModal
        }
    } = useContext(ContentCreatorContext);
    const { push } = useHistory();
    const { sequence } = useParams();
    const { role } = useUser();

    const isStudent = role === "student";

    const openEditStepModal = () => {
        if (!isStudent) {
            setEditStepModal(true);
        }
    };

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
            const item = items
                .find(({ id: itemID }) => itemID === id);

            return (
                <ItemCard
                    showButton
                    key={ `${id}-${index}` }
                    name={ name }
                    image={ item && item.image
                        ? getImageURL(item.image)
                        : undefined }
                    quantity={ { amount, unit } }
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
            item: { id: itemID, name },
            amount,
            unit,
        } = result;

        const item = items
            .find(({ id }) => itemID === id);

        return (
            <ItemCard
                showButton
                name={ name }
                image={ item && item.image
                    ? getImageURL(item.image)
                    : undefined }
                quantity={ { amount, unit } }
                onCloseClick={ createOnItemCloseClick(
                    "result", dependencyID
                ) }
            />
        );
    };

    if (isStudent && !step) {
        return (
            <div
                className={ styles.empty }
            >
                Previewing recipe as a student
            </div>
        );
    }

    if (!step) {
        return (
            <div
                className={ styles.empty }
            >
                <div>
                    Choose a step on the left to edit!
                </div>
                <div>
                    <i
                        className="fas fa-plus"
                    />
                    <span>
                        Add an item
                    </span>
                </div>
                <div>
                    <i
                        className="fas fa-play"
                    />
                    <span>
                        Play through recipe
                    </span>
                </div>
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
                    { role && !isStudent && (
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
                    ) }
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
