import React, { useState, useCallback } from "react";

import useAPI from "../../hooks/useAPI";

import Modal from "../../shared/Modal";
import TextField from "../../controls/TextField";
import ButtonBase from "../../controls/ButtonBase";
import { createChangeEventStateSetter } from "../../../utils";

import styles from "./CreateRecipeModal.module.scss";

interface CreateRecipeModalProps {
    control: (state: boolean) => void;
    update: () => void;
}

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
    control,
    update,
}) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const createControlSetter = (state: boolean) => () => control(state);

    const request = useAPI();

    const addRecipe = useCallback(async () => {
        await request(
            "/addRecipe",
            {
                method: "POST",
                data: {
                    username: "aw",
                    recipeName: name,
                    description
                }
            }
        );
    }, [request, name]);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addRecipe().then(() =>  update());
        control(false);
    };

    return (
        <Modal
            show
            title="Make your recipe"
            onBackdropClick={ createControlSetter(false) }
        >
            <form
                onSubmit={ onSubmit }
            >
                <div
                    className={ styles.form }
                >
                    <TextField
                        required
                        placeholder="Recipe Name"
                        value={ name }
                        onChange={ createChangeEventStateSetter(setName) }
                    />
                    <TextField
                        placeholder="Recipe Description"
                        value={ description }
                        onChange={ createChangeEventStateSetter(setDescription) }
                    />
                    <div
                        className={ styles.actions }
                    >
                        <ButtonBase
                            inverted
                            type="button"
                            onClick={ createControlSetter(false) }
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

export default CreateRecipeModal;
