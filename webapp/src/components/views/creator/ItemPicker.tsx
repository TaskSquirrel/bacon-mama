import React, { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { ContentCreatorContext } from "./ContentCreatorProvider";

import styles from "./ItemPicker.module.scss";
import ButtonBase from "../../controls/ButtonBase";

const ItemPicker: React.FC = () => {
    const {
        metadata: {
            id: recipeID
        },
        steps,
        items
    } = useContext(ContentCreatorContext);

    const { sequence } = useParams();

    const step = steps.find(({ sequence: seq }) => {
        return `${seq}` === sequence;
    });

    if (!step) {
        return null;
    }

    return (
        <div className={ styles.container }>
            <div className={ styles.items }>
                {
                    step.dependencies.map((
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
                            <div
                                key={ `${id}-${index}` }
                                className={ styles.item }
                            >
                                <h3
                                    className={ styles.title }
                                >
                                    { name }
                                </h3>
                                <div>
                                    { amount } { unit }
                                </div>
                            </div>
                        );
                    })
                }
                <Link
                    to={ `/items/${recipeID}/${sequence}` }
                >
                    <ButtonBase>
                        Add
                    </ButtonBase>
                </Link>
            </div>
            <div>
                Test
            </div>
        </div>
    );
};

export default ItemPicker;
