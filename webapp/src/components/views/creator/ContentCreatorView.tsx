import React, { useContext } from "react";

import Steps from "./Steps";
import ItemPicker from "./ItemPicker";
import ItemsList from "./items/ItemsList";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import ButtonBase from "../../controls/ButtonBase";

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
                    <ButtonBase
                        onClick={ openAddItemModal }
                    >
                        Add item
                    </ButtonBase>
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
