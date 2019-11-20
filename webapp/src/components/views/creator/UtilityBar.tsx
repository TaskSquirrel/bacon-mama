import React, { useContext } from "react";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import ButtonBase from "../../controls/ButtonBase";

import styles from "./UtilityBar.module.scss";

const UtilityBar: React.FC = () => {
    const {
        available,
        metadata: {
            name
        }
    } = useContext(ContentCreatorContext);

    return (
        <div
            className={ styles.bar }
        >
            <div
                className={ styles.metadata }
            >
                <h2
                    className={ styles.name }
                >
                    { name }
                </h2>
            </div>
            <div>
                <ButtonBase>
                    Add item
                </ButtonBase>
            </div>
        </div>
    );
};

export default UtilityBar;
