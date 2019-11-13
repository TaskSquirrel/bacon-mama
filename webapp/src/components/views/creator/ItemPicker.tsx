import React, { useContext, useState } from "react";

import { ContentCreatorContext } from "./ContentCreatorProvider";

import styles from "./ItemPicker.module.scss";
import { useParams } from "react-router";

const ItemPicker: React.FC = () => {
    const {
        steps,
    } = useContext(ContentCreatorContext);

    const { sequence } = useParams();

    const step = steps.find((step) => {
        return `${step.sequence}` === sequence;
    })

    if(!step) {
        return null;
    }

    return (
        <div className={ styles.container }>
            <div className={ styles.items }>
                {
                    step.dependencies.map((d,i) => {
                        return (
                            <div
                                className={styles.item}
                                key={i}
                            >
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default ItemPicker;
