import React, { useContext, useState } from "react";
import { useParams, Redirect, useHistory } from "react-router-dom";

import { Dependency } from "../../../models/recipe";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import Modal from "../../shared/Modal";
import TextField from "../../controls/TextField";
import ButtonBase from "../../controls/ButtonBase";

import { createChangeEventStateSetter } from "../../../utils";

import styles from "./ItemsViewer.module.scss";

const ItemsViewer: React.FC = () => {
    const {
        available,
        items,
        steps,
        actions: {
            replaceStep
        }
    } = useContext(ContentCreatorContext);
    const { id, sequence } = useParams();
    const { push } = useHistory();
    const [amount, setAmount] = useState<string>("");
    const [unit, setUnit] = useState<string>("");
    const [selected, setSelected] = useState<string>("");

    const goToRecipeEditor = () => {
        push(`/edit/${id}`);
    };

    const createItemSelector = (itemID: string) => () => {
        setSelected(itemID);
    };

    const addItemToStep = (itemID: string) => {
        const step = steps.find(({ sequence: seq }) => `${seq}` === sequence);

        if (!step) {
            return;
        }

        replaceStep({
            ...step,
            dependencies: [
                ...step.dependencies,
                {
                    amount: Number(amount),
                    unit,
                    item: {
                        id: itemID
                    }
                } as Dependency
            ]
        });
    };

    const createFromSubmit = (itemID: string) => (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        addItemToStep(itemID);
        setSelected("");
    };

    const renderItems = () => {
        if (items.length === 0) {
            return (
                <div>
                    No items to show!
                </div>
            );
        }

        return items
            .map(({ id: itemID, name: itemName }) => {
                return (
                    <div
                        key={ itemID }
                        className={ styles.item }
                    >
                        <div>
                            { itemName }
                        </div>
                        <div>
                            <ButtonBase
                                onClick={ createItemSelector(itemID) }
                            >
                                Add
                            </ButtonBase>
                        </div>
                    </div>
                );
            });
    };

    if (!available) {
        return null;
    }

    if (!id) {
        return (
            <Redirect
                to="/"
            />
        );
    }

    return (
        <div
            className={ styles.window }
        >
            <div
                className={ styles.actions }
            >
                <h1
                    className={ styles.heading }
                >
                    Items
                </h1>
                <ButtonBase
                    onClick={ goToRecipeEditor }
                >
                    Done
                </ButtonBase>
            </div>
            <div
                className={ styles.items }
            >
                { renderItems() }
            </div>
            { selected !== "" && (
                <Modal
                    show={ selected !== "" }
                    title="Add item to step"
                    onBackdropClick={ createItemSelector("") }
                >
                    <form
                        onSubmit={ createFromSubmit(selected) }
                    >
                        <div>
                            <TextField
                                value={ amount }
                                onChange={ createChangeEventStateSetter(setAmount) }
                            />
                            <TextField
                                value={ unit }
                                onChange={ createChangeEventStateSetter(setUnit) }
                            />
                            <ButtonBase
                                type="submit"
                            >
                                Add
                            </ButtonBase>
                        </div>
                    </form>
                </Modal>
            ) }
        </div>
    );
};

export default ItemsViewer;
