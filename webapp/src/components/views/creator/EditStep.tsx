import React, { useContext, useState } from "react";

import { Step } from "../../../models/recipe";

import TextField from "../../controls/TextField";
import TextArea from "../../controls/TextArea";
import ButtonBase from "../../controls/ButtonBase";
import Modal from "../../shared/Modal";
import { ContentCreatorContext } from "./ContentCreatorProvider";

import { createChangeEventStateSetter } from "../../../utils";

import styles from "./EditStep.module.scss";

interface EditStepProps {
    show: boolean;
    step: Step;
    close: () => void;
}

const EditStep: React.FC<EditStepProps> = ({
    show, step, close
}) => {
    const {
        actions: {
            replaceStep
        }
    } = useContext(ContentCreatorContext);
    const [name, setName] = useState<string>(step.name);
    const [description, setDescription] = useState<string>(
        step.description || ""
    );

    const save = () => {
        if (name === "" || description === "") {
            return null;
        }

        replaceStep({
            ...step,
            verb: name,
            description
        });
        close();
    };

    const onFormSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        save();
    };

    return (
        <Modal
            show={ show }
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
                    <TextArea
                        required
                        placeholder="Step description"
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
