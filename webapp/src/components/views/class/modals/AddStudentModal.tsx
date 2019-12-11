import React, { useState, useCallback } from "react";

import useAPI from "../../../hooks/useAPI";
import useUser from "../../../hooks/useUser";

import Modal from "../../../shared/Modal";
import TextField from "../../../controls/TextField";
import ButtonBase from "../../../controls/ButtonBase";
import { createChangeEventStateSetter } from "../../../../utils";

import styles from "./CreateClassModal.module.scss";
import { APIClassList } from './../../../../models/API';

interface CreateRecipeModalProps {
    list?: any[];
    control: (state: boolean) => void;
    update: () => void;
    info?:string;
    course?: APIClassList | null;
}

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
    control,
    update,
    list,
    info,
    course
}) => {
    const [name, setName] = useState<string>("");
    const { name: userName } = useUser();
    const request = useAPI();

    const createControlSetter = (state: boolean) => () => control(state);


    const addRecipe = useCallback(async () => {
        await request(
            "/addRecipeToCourse",
            {
                method: "POST",
                data: {
                    username: userName,
                    course: name,
                }
            }
        );
    }, [request, name]);

    const addStudent = useCallback(async () => {
        console.log(course);
        
        await request(
            "/addStudentToCourse",
            {
                method: "POST",
                data: {
                    username: name,
                    course,
                }
            }
        );
    }, [request, name]);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const throwaway = info === "recipe" ? addRecipe().then(() =>  update()) : addStudent().then(() => update());
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
                        placeholder="Student Name"
                        value={ name }
                        onChange={ createChangeEventStateSetter(setName) }
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
