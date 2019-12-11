import React, { useContext, useState } from "react";

import { Step } from "../../../../models/recipe";

import TextField from "../../../controls/TextField";
import TextArea from "../../../controls/TextArea";
import ButtonBase from "../../../controls/ButtonBase";
import Modal from "../../../shared/Modal";
import { ContentCreatorContext } from "../ContentCreatorProvider";

import { createChangeEventStateSetter } from "../../../../utils";

import styles from "./modals.module.scss";

interface EditStepProps {
    step: Step;
    control: (state: boolean) => void;
}

const EditStep: React.FC<EditStepProps> = ({
    step, control
}) => {
    const {
        actions: {
            replaceStep
        }
    } = useContext(ContentCreatorContext);
    const [name, setName] = useState<string>(step.name);
    const [verb, setVerb] = useState<string>(step.verb);
    const [description, setDescription] = useState<string>(
        step.description || ""
    );

    const close = () => control(false);

    const save = () => {
        if (name === "" || description === "") {
            return null;
        }

        replaceStep({
            ...step,
            name,
            verb,
            description
        });
        control(false);
    };

    const onFormSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        save();
    };

    return (
        <Modal
            show
            title="Edit step details"
        >
            <form
                onSubmit={ onFormSubmit }
            >
                <div
                    className={ styles.form }
                >
                    <TextField
                        required
                        placeholder="Step name"
                        value={ name }
                        onChange={ createChangeEventStateSetter(
                            setName
                        ) }
                    />
                    <TextField
                        required
                        placeholder="Step action"
                        value={ verb }
                        onChange={ createChangeEventStateSetter(
                            setVerb
                        ) }
                    />
                    <TextArea
                        required
                        placeholder="Step description - be informative!"
                        value={ description }
                        onChange={ createChangeEventStateSetter(
                            setDescription
                        ) }
                    />
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
                </div>
            </form>
        </Modal>
    );
};

export default EditStep;
