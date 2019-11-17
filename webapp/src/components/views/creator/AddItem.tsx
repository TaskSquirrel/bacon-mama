import React, { useState, useContext } from "react";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import Modal from "../../shared/Modal";
import TextField from "../../controls/TextField";
import TextArea from "../../controls/TextArea";
import ButtonBase from "../../controls/ButtonBase";

import { createChangeEventStateSetter } from "../../../utils";

import styles from "./EditStep.module.scss";

interface AddItemProps {
    control: (state: boolean) => void;
}

const AddItem: React.FC<AddItemProps> = ({
    control
}) => {
    const {
        actions: {
            addItem
        }
    } = useContext(ContentCreatorContext);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const close = () => control(false);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (name === "" || description === "") {
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
                <div
                    className={ styles.form }
                >
                    <TextField
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
                    <div
                        className={ styles.action }
                    >
                        <ButtonBase
                            inverted
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
                </div>
            </form>
        </Modal>
    );
};

export default AddItem;
