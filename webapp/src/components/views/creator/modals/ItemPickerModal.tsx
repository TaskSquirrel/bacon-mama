import React, { useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import classNames from "classnames";

import { Item, Step, Dependency } from "../../../../models/recipe";

import { ContentCreatorContext } from "../ContentCreatorProvider";
import ButtonBase from "../../../controls/ButtonBase";
import TextField from "../../../controls/TextField";
import FullModal from "../../../shared/FullModal";
import Responsive from "../../../shared/Responsive";
import Stack from "../../../shared/Stack";

import { isNumber } from "../../../../utils";

import styles from "./ItemPickerModal.module.scss";
import modalStyles from "./modals.module.scss";

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

    const { dependencies } = currentStep;

    const exists = dependencies.find(
        ({ item: { id: itemID } }) => itemID === selected
    );

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

        if (!selected || !amount || !unit || !isNumber(amount)) {
            return;
        }

        const asNumber = Number(amount);

        if (asNumber < 0) {
            return;
        }

        if (pick === "dependencies") {
            const { dependencies: deps } = currentStep;

            if (exists) {
                return;
            }

            replaceStep({
                ...currentStep,
                dependencies: [
                    ...deps,
                    {
                        item: {
                            id: selected
                        },
                        amount: asNumber,
                        unit
                    } as Dependency
                ]
            });
        } else {
            replaceStep({
                ...currentStep,
                result: {
                    item: {
                        id: selected
                    },
                    amount: asNumber,
                    unit
                } as Dependency
            });
        }

        close();
    };

    const renderSuggestion = () => {
        if (!isNumber(amount)) {
            return (
                <div>
                    Please enter a number!
                </div>
            );
        }

        let suggestion;
        const asNumber = Number(amount);

        if (asNumber > 1000) {
            suggestion = "We suggest using numbers less than 1000 and switching units.";
        } else if (asNumber < 0) {
            suggestion = "No negatives!";
        }

        return (
            <div>
                { suggestion }
            </div>
        );
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

    const renderItemsContainer = () => {
        if (items.length > 0) {
            return (
                <div
                    className={ styles.items }
                >
                    { renderItems() }
                </div>
            );
        }

        return (
            <div>
                You did not add any items to this recipe yet!
            </div>
        );
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
                            <Stack
                                className={ styles.header }
                            >
                                <h3>
                                    Measurement
                                </h3>
                                <div
                                    className={ styles.description }
                                >
                                    Describe how much of an item you want to add including its unit.
                                    Amounts are rounded to the nearest tenth.
                                </div>
                            </Stack>
                            <Stack
                                inline
                                className={ styles.measurement }
                            >
                                <TextField
                                    required
                                    placeholder="Amount"
                                    className={ styles.amount }
                                    value={ amount }
                                    onChange={ onAmountChange }
                                />
                                <TextField
                                    required
                                    placeholder="Unit"
                                    value={ unit }
                                    onChange={ onUnitChange }
                                />
                                <div>
                                    { renderSuggestion() }
                                </div>
                            </Stack>
                        </div>
                        <Stack>
                            <h3>
                                Available items
                            </h3>
                            { exists && (
                                <div
                                    className={ styles.error }
                                >
                                    Item is already added as a dependency in this step!
                                </div>
                            ) }
                            { renderItemsContainer() }
                        </Stack>
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
