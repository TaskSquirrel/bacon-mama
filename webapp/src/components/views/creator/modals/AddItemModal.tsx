import React, { useState, useContext } from "react";

import { ContentCreatorContext } from "../ContentCreatorProvider";
import Modal from "../../../shared/Modal";
import TextField from "../../../controls/TextField";
import TextArea from "../../../controls/TextArea";
import Upload from "../../../controls/Upload";
import ButtonBase from "../../../controls/ButtonBase";
import Stack from "../../../shared/Stack";

import { createChangeEventStateSetter } from "../../../../utils";

import styles from "./modals.module.scss";
import addItemModalStyles from "./AddItemModal.module.scss";

interface AddItemProps {
    control: (state: boolean) => void;
}

const AddItem: React.FC<AddItemProps> = ({
    control
}) => {
    const {
        items,
        actions: {
            addItem
        }
    } = useContext(ContentCreatorContext);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const itemNameAlreadyInUse = items.find(
        ({ name: itemName }) => itemName === name
    );

    const close = () => control(false);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (name === "" || description === "" || itemNameAlreadyInUse) {
            return;
        }

        addItem(name, description);
        control(false);
    };

    return (
        <Modal
            show
            title="Add item"
        >
            <form
                onSubmit={ submit }
            >
                <Stack>
                    { itemNameAlreadyInUse && (
                        <div
                            className={ addItemModalStyles.error }
                        >
                            { `"${name}" is already an item!` }
                        </div>
                    ) }
                    <TextField
                        required
                        placeholder="Item name"
                        value={ name }
                        onChange={ createChangeEventStateSetter(
                            setName
                        ) }
                    />
                    <TextArea
                        placeholder="Item description"
                        value={ description }
                        onChange={ createChangeEventStateSetter(
                            setDescription
                        ) }
                    />
                    <Upload />
                    <div
                        className={ styles.actions }
                    >
                        <ButtonBase
                            inverted
                            clear
                            type="button"
                            onClick={ close }
                        >
                            Cancel
                        </ButtonBase>
                        <ButtonBase
                            type="submit"
                        >
                            Save
                        </ButtonBase>
                    </div>
                </Stack>
            </form>
        </Modal>
    );
};

export default AddItem;
