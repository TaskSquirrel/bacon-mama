import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
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
    } = useContext(ContentCreatorContext);

    const { sequence } = useParams();

    const step = steps.find(({ sequence: seq }) => {
        return `${seq}` === sequence;
    });

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
                    <Link
                        to={ `/items/${recipeID}/${sequence}` }
                    >
                        <AuraButton>
                            <i
                                className="fas fa-plus"
                            />
                        </AuraButton>
                    </Link>
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
