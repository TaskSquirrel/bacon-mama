import React, { useState } from "react";
import classNames from "classnames";

import { Item } from "../../../../models/recipe";

import Modal from "../../../shared/Modal";

import styles from "./ItemPickerModal.module.scss";
import modalStyles from "../EditStep.module.scss";

interface ItemPickerModalProps {
    items: Item[];
    control: (state: boolean) => void;
}

const ItemPickerModal: React.FC<ItemPickerModalProps> = ({
    items, control
}) => {
    const [selected, setSelected] = useState<Item | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [unit, setUnit] = useState<string>("");

    const onSubmit = () => {};

    const renderItems = () => {
        return items.map(({
            id, name
        }) => {
            return (
                <div
                    key={ id }
                    className={ classNames(
                        styles.item
                    ) }
                >
                    { name }
                </div>
            );
        });
    };

    return (
        <Modal
            show
            title="Pick item"
        >
            <form
                onSubmit={ onSubmit }
            >
                <div
                    className={ modalStyles.form }
                >
                    <div>
                        { renderItems() }
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ItemPickerModal;
