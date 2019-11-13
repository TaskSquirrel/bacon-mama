import React, { useState, useContext } from "react";

import Modal from "../../shared/Modal";
import TextField from "../../controls/TextField";
import TextArea from "../../controls/TextArea";
import ButtonBase from "../../controls/ButtonBase";

import { createChangeEventStateSetter } from "../../../utils";

import styles from "./EditStep.module.scss";
import { ContentCreatorContext } from "./ContentCreatorProvider";

interface AddItemProps {
    show: boolean;
    close: () => void;
}

const AddItem: React.FC<AddItemProps> = ({
    show,
    close
}) => {
    const {
        actions: {
            addItem
        }
    } = useContext(ContentCreatorContext);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (name === "" || description === "") {
            return;
        }

        addItem(name, description);
        close();
    };

    return (
        <Modal
            show={ show }
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
