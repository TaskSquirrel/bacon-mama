import React, { useState, useContext } from "react";
import classNames from "classnames";
import { useParams, useHistory } from "react-router-dom";

import { Item, Step, Dependency } from "../../../../models/recipe";

import { ContentCreatorContext } from "../ContentCreatorProvider";
import ButtonBase from "../../../controls/ButtonBase";
import TextField from "../../../controls/TextField";
import FullModal from "../../../shared/FullModal";
import Responsive from "../../../shared/Responsive";

import styles from "./ItemPickerModal.module.scss";
import modalStyles from "../EditStep.module.scss";

interface ItemPickerModalProps {
    show: boolean;
    currentStep: Step;
    items: Item[];
    pick: "dependencies" | "result";
}

const ItemPickerModal: React.FC<ItemPickerModalProps> = ({
    show, items, currentStep, pick
}) => {
    const {
        actions: {
            replaceStep
        }
    } = useContext(ContentCreatorContext);
    const [selected, setSelected] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [unit, setUnit] = useState<string>("");
    const { id: recipeID, sequence: stepSequence } = useParams();
    const { push } = useHistory();

    const title = pick === "dependencies"
        ? "Add a dependency"
        : "Choose result item";

    const close = () => {
        push(`/edit/${recipeID}/${stepSequence}`);
    };

    const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    };

    const onUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUnit(event.target.value);
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selected || !amount || !unit) {
            return;
        }

        if (pick === "dependencies") {
            replaceStep({
                ...currentStep,
                dependencies: [
                    ...currentStep.dependencies,
                    {
                        item: {
                            id: selected
                        },
                        amount: Number(amount),
                        unit
                    } as Dependency
                ]
            });
        } else {
            console.log("Picking result...");

            replaceStep({
                ...currentStep,
                result: {
                    item: {
                        id: selected
                    },
                    amount: Number(amount),
                    unit
                } as Dependency
            });
        }

        close();
    };

    const createSelectItem = (id: string) => () => setSelected(id);

    const renderItems = () => {
        return items.map(({
            id, name
        }) => {
            return (
                <div
                    key={ id }
                    className={ classNames(
                        styles.item,
                        selected === id && styles.selected
                    ) }
                    onClick={ createSelectItem(id) }
                >
                    { name }
                </div>
            );
        });
    };

    return (
        <FullModal
            show={ show }
            title={ title }
            subtitle="Pick an item to add to the step!"
            control={ close }
        >
            <Responsive>
                <form
                    onSubmit={ onSubmit }
                >
                    <div
                        className={ modalStyles.form }
                    >
                        <div>
                            <h3>
                                Measurement
                            </h3>
                            <div>
                                <TextField
                                    required
                                    placeholder="Amount"
                                    value={ amount }
                                    onChange={ onAmountChange }
                                />
                                <TextField
                                    required
                                    placeholder="Unit"
                                    value={ unit }
                                    onChange={ onUnitChange }
                                />
                            </div>
                        </div>
                        <div>
                            <h3>
                                Available items
                            </h3>
                            <div
                                className={ styles.items }
                            >
                                { renderItems() }
                            </div>
                        </div>
                    </div>
                    <div
                        className={ styles.actions }
                    >
                        <ButtonBase
                            type="submit"
                        >
                            Add
                        </ButtonBase>
                    </div>
                </form>
            </Responsive>
        </FullModal>
    );
};

export default ItemPickerModal;
