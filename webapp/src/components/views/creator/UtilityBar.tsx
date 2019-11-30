import React, { useContext } from "react";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import ButtonBase from "../../controls/ButtonBase";

import styles from "./UtilityBar.module.scss";

const UtilityBar: React.FC = () => {
    const {
        metadata: {
            name
        },
        actions: {
            setAddItemModal
        }
    } = useContext(ContentCreatorContext);

    const openAddItemModal = () => setAddItemModal(true);

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
                <ButtonBase
                    onClick={ openAddItemModal }
                >
                    <span>
                        <i
                            className="fas fa-plus"
                        />
                    </span>
                    <span>
                        Add item
                    </span>
                </ButtonBase>
            </div>
        </div>
    );
};

export default UtilityBar;
