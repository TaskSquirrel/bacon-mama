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
        steps,
        actions: {
        }
    } = useContext(ContentCreatorContext);
    const { push } = useHistory();

    const { sequence } = useParams();

    const step = steps.find(({ sequence: seq }) => {
        return `${seq}` === sequence;
    });

    const openDependencyPicker = () => {
        push(`/edit/${recipeID}/${sequence}/deps`);
    };

    const openResultPicker = () => {
        push(`/edit/${recipeID}/${sequence}/creates`);
    };

    const renderItems = (currentStep: Step) => {
        const { dependencies } = currentStep;

        return dependencies.map((
            {
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
            item: { name },
            amount,
            unit
        } = result;

        return (
            <ItemCard
                name={ name }
                quantity={ { amount, unit } }
            />
        );
    };

    if (!step) {
        return null;
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
