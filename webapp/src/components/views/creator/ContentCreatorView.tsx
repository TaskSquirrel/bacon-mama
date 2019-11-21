import React, { useContext } from "react";

import Steps from "./Steps";
import ItemPicker from "./ItemPicker";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import UtilityBar from "./UtilityBar";

import styles from "./ContentCreatorView.module.scss";

const CreateRecipe: React.FC = () => {
    const {
        available,
        actions: {
            setAddItemModal
        }
    } = useContext(ContentCreatorContext);

    const openAddItemModal = () => setAddItemModal(true);

    if (!available) {
        return null;
    }

    return (
        <div
            className={ styles.container }
        >
            <div
                className={ styles.left }
            >
                <Steps />
            </div>
            <div
                className={ styles.content }
            >
                <div
                    className={ styles.top }
                >
                    <UtilityBar />
                </div>
                <div
                    className={ styles.center }
                >
                    <ItemPicker />
                </div>
            </div>
        </div>
    );
};

export default CreateRecipe;
