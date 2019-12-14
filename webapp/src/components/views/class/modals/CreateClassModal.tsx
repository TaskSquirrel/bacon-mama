import React, { useState, useCallback } from "react";

import Modal from "../../../shared/Modal";
import TextField from "../../../controls/TextField";
import ButtonBase from "../../../controls/ButtonBase";
import useAPI from "../../../hooks/useAPI";
import useUser from "../../../hooks/useUser";

import { createChangeEventStateSetter } from "../../../../utils";

import styles from "./CreateClassModal.module.scss";

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
    const { name: userName } = useUser();
    const request = useAPI();

    const createControlSetter = (state: boolean) => () => control(state);

    const addRecipe = useCallback(async () => {
        await request(
            "/addCourse",
            {
                method: "POST",
                data: {
                    professor: userName,
                    courseName: name,
                }
            }
        );
    }, [request, name, userName]);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addRecipe().then(() =>  update());
        control(false);
    };

    return (
        <Modal
            show
            title="Create your course"
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
                        placeholder="Course Name"
                        value={ name }
                        onChange={ createChangeEventStateSetter(setName) }
                    />
                    <TextField
                        placeholder="Course Description"
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
