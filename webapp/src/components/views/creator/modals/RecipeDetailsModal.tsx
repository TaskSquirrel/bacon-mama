import React, { useContext, useState } from "react";

import { ContentCreatorContext } from "../ContentCreatorProvider";
import Stack from "../../../shared/Stack";
import Modal from "../../../shared/Modal";
import TextField from "../../../controls/TextField";
import TextArea from "../../../controls/TextArea";
import ButtonBase from "../../../controls/ButtonBase";

import { createChangeEventStateSetter } from "../../../../utils";

import styles from "./modals.module.scss";

interface RecipeDetailsModalProps {
    control: (state: boolean) => void;
}

const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({
    control
}) => {
    const {
        metadata: {
            name,
            description,
        },
        actions: {
            replaceRecipe,
        },
    } = useContext(ContentCreatorContext);
    const [recipeName, setRecipeName] = useState<string>(name);
    const [recipeDescription, setRecipeDescription] = useState<string>(description || "");

    const close = () => control(false);

    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!recipeName) {
            return;
        }

        const save = async () => {
            await replaceRecipe(recipeName, recipeDescription);

            close();
        };

        save();
    };

    return (
        <Modal
            show
            title="Edit recipe details"
        >
            <form
                onSubmit={ onFormSubmit }
            >
                <Stack>
                    <TextField
                        required
                        type="text"
                        placeholder="Recipe name"
                        value={ recipeName }
                        onChange={ createChangeEventStateSetter(setRecipeName) }
                    />
                    <TextArea
                        placeholder="Recipe description"
                        value={ recipeDescription }
                        onChange={ createChangeEventStateSetter(setRecipeDescription) }
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
                </Stack>
            </form>
        </Modal>
    );
};

export default RecipeDetailsModal;
