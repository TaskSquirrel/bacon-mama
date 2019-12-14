import React, { useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import { Item, Step, Dependency } from "../../../../models/recipe";

import { ContentCreatorContext } from "../ContentCreatorProvider";
import ButtonBase from "../../../controls/ButtonBase";
import TextField from "../../../controls/TextField";
import FullModal from "../../../shared/FullModal";
import Responsive from "../../../shared/Responsive";
import Stack from "../../../shared/Stack";
import ItemPickerItem from "./ItemPickerItem";

import {
    isNumber,
    createChangeEventStateSetter,
    getImageURL
} from "../../../../utils";

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
    const [query, setQuery] = useState<string>("");
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

    const close = () => push(`/edit/${recipeID}/${stepSequence}`);

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

    const renderItems = () => items
        .filter(({ name }) => {
            const lowerCaseQuery = query.toLowerCase();
            const lowerCaseName = name.toLowerCase();

            return lowerCaseName.startsWith(lowerCaseQuery);
        })
        .map(({ id, name, image }) => {
            return (
                <ItemPickerItem
                    key={ id }
                    selected={ selected === id }
                    image={ image ? getImageURL(`${image}`) : undefined }
                    name={ name }
                    onClick={ createSelectItem(id) }
                />
            );
        });

    const renderItemsContainer = () => {
        if (items.length > 0) {
            const renderableItems = renderItems();

            if (renderableItems.length === 0) {
                return (
                    <div>
                        { `"${query}" not found!` }
                    </div>
                );
            }

            return (
                <div
                    className={ styles.items }
                >
                    { renderableItems }
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
                        <Stack>
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
                                    type="text"
                                    placeholder="Amount"
                                    className={ styles.amount }
                                    value={ amount }
                                    onChange={ createChangeEventStateSetter(
                                        setAmount
                                    ) }
                                />
                                <TextField
                                    required
                                    type="text"
                                    placeholder="Unit"
                                    value={ unit }
                                    onChange={ createChangeEventStateSetter(
                                        setUnit
                                    ) }
                                />
                                <div>
                                    { renderSuggestion() }
                                </div>
                            </Stack>
                        </Stack>
                        <Stack>
                            <div
                                className={ styles.inline }
                            >
                                <h3>
                                    Available items
                                </h3>
                                <div>
                                    <TextField
                                        type="text"
                                        placeholder="Filter"
                                        className={ styles.search }
                                        value={ query }
                                        onChange={ createChangeEventStateSetter (
                                            setQuery
                                        ) }
                                    />
                                </div>
                            </div>
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
