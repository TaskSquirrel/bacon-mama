import React, { useState, useCallback, SyntheticEvent } from "react";
import { Dropdown, DropdownProps } from "semantic-ui-react";

import { APIClassList } from "./../../../../models/API";

import useAPI from "../../../hooks/useAPI";

import Modal from "../../../shared/Modal";
import ButtonBase from "../../../controls/ButtonBase";

import styles from "./CreateClassModal.module.scss";

interface CreateRecipeModalProps {
    control: (state: boolean) => void;
    update: () => void;
    info?: string;
    course?: APIClassList | null;
    options: Options[] | null;
}

interface Options {
    key: number;
    text: string;
    value: number;
}

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
    control,
    update,
    info,
    course,
    options
}) => {
    const request = useAPI();
    const [selected, setSelected] = useState<any[] | any>(undefined);

    const createControlSetter = (state: boolean) => () => control(state);

    const addRecipe = useCallback(async () => {
        await request(
            "/addRecipeToCourse",
            {
                method: "POST",
                data: {
                    recipe: selected !== undefined ? {id:selected} : "",
                    course,
                }
            }
        );
    }, [request, course, selected]);

    const addStudent = useCallback(async () => {
        await request(
            "/addStudentToCourse",
            {
                method: "POST",
                data: {
                    username: selected !== undefined ? selected : "",
                    course,
                }
            }
        );
    }, [request, course, selected]);

    const onOptionChange = (event: SyntheticEvent<HTMLElement, Event>, {value}:DropdownProps) => {
        setSelected(value);
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!selected){
            return;
        }
        if(info === "recipe"){
            addRecipe().then(() =>  update());
        }
        else{
            addStudent().then(() => update());
        }
        control(false);
    };

    return (
        <Modal
            show
            title={`Add your ${info}s`}
            onBackdropClick={ createControlSetter(false) }
        >
            <form
                onSubmit={ onSubmit }
            >
                <div
                    className={ styles.form }
                >
                    <Dropdown placeholder={`${info}`} fluid selection options={options ? options : []} onChange={onOptionChange} />
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
