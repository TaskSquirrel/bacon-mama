import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AxiosRequestConfig } from "axios";

import { APIRecipeResponse } from "../../../models/API";
import { Recipe, Step, Item } from "../../../models/recipe";
import { ItemState } from "../../../models/play";

import useLoadingIndicator from "../../hooks/useLoadingIndicator";
import useAPI from "../../hooks/useAPI";

import { fromAPIRecipe } from "../../../api/mappings";
import { noop } from "../../../utils";

export interface PlaythroughContextShape {
    error: boolean;
    recipe: Recipe | null;
    currentStep: Step | null;
    selected: Item | null;
    itemState: ItemState[];
    isLastStep: boolean;
    errorMarks: number;
    stepDone: boolean;
    select: (id: string | null) => void;
    replace: (id: string, amount: number) => void;
    nextStep: () => void;
}

export const PlaythroughContextDefaultShape: PlaythroughContextShape = {
    error: false,
    recipe: null,
    currentStep: null,
    stepDone: false,
    selected: null,
    itemState: [],
    isLastStep: false,
    errorMarks: 0,
    select: noop,
    replace: noop,
    nextStep: noop,
};

export const PlaythroughContext = React.createContext<PlaythroughContextShape>(
    PlaythroughContextDefaultShape
);

const PlaythroughProvider: React.FC = ({ children }) => {
    const [error, setError] = useState<boolean>(false);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [currentStep, setCurrentStep] = useState<Step | null>(null);
    const [stepDone, setStepDone] = useState<boolean>(false);

    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [itemState, setItemState] = useState<ItemState[]>([]);
    const [errorMarks, setErrorMarks] = useState<number>(0);

    const { id: recipeID } = useParams();
    const { setStatus } = useLoadingIndicator();
    const request = useAPI();

    const isLastStep = recipe && currentStep
        ? currentStep.sequence === recipe.steps.length - 1
        : false;
    const selected = recipe
        ? recipe.items.find(({ id }) => selectedItem === id) || null
        : null;

    const doRequest = useCallback(async (
        endpoint: string,
        payload: AxiosRequestConfig
    ) => {
        try {
            setStatus(true);

            const { data } = await request<APIRecipeResponse>(
                endpoint,
                payload
            );

            const { status, message, recipe: responseRecipe } = data;

            if (status === "OK") {
                setRecipe(fromAPIRecipe(responseRecipe));
            } else {
                throw new Error(message);
            }
        } catch (e) {
            if (!e.message) {
                throw new Error("Network request error!");
            } else {
                throw e;
            }
        } finally {
            setStatus(false);
        }
    }, [request, setStatus]);

    const nextStep = () => {
        if (!recipe) {
            return;
        }

        const { steps } = recipe;

        if (!currentStep) {
            setCurrentStep(
                steps.find(({ sequence }) => sequence === 0) || null
            );
        } else {
            const { sequence } = currentStep;

            if (sequence === steps.length - 1) {
                return;
            }

            setCurrentStep(
                steps.find(({ sequence: stepSeq }) => stepSeq === sequence + 1)
                || null
            );
        }
    };

    const select = (item: string | null) => {
        if (stepDone) {
            return;
        }

        setSelectedItem(
            item === selectedItem || !item
                ? null
                : item
        );
    };

    const replaceItemState = (id: string, amount: number) => {
        if (!currentStep || stepDone) {
            return;
        }

        const { dependencies } = currentStep;

        // Check if item is a dependency
        const foundDependency = dependencies.find(
            ({ item: { id: itemID } }) => itemID === id
        );

        if (!foundDependency) {
            setErrorMarks((prevErrorMarks) => prevErrorMarks + 1);

            return;
        }

        const find = itemState.find(
            ({ id: itemStateID }) => itemStateID === id
        );

        const nextAmount = Math.round((find ? find.amount + amount : amount) * 100) / 100;
        const outOfToleranceRange = nextAmount - foundDependency.amount > 0.1;

        if (outOfToleranceRange) {
            // No dependency or attempting to add more
            setErrorMarks((prevErrorMarks) => prevErrorMarks + 1);

            return;
        }

        const removed = itemState.filter(
            ({ id: itemStateID }) => itemStateID !== id
        );

        setItemState([
            ...removed,
            { id, amount: nextAmount }
        ]);
    };

    useEffect(() => {
        if (!recipe && !error) {
            const fetchRecipe = async () => {
                try {
                    await doRequest(
                        "/getRecipe",
                        {
                            method: "POST",
                            data: {
                                id: recipeID
                            }
                        }
                    );
                } catch (e) {
                    setError(true);
                }
            };

            fetchRecipe();
        }
    }, [error, recipe, recipeID, doRequest]);

    useEffect(() => {
        setItemState([]);
        setSelectedItem(null);
        setStepDone(false);
    }, [currentStep]);

    useEffect(() => {
        const checkCompletion = () => {
            if (!currentStep) {
                return false;
            }

            const { dependencies } = currentStep;

            if (dependencies.length === 0) {
                return true;
            }

            if (itemState.length === 0) {
                // If there are dependencies and item state is not set then incomplete

                return false;
            }

            const completedDependencies = dependencies.filter(({
                item: { id: itemID }, amount: requiredAmount
            }) => {
                const inItemState = itemState.find(({ id }) => itemID === id);

                if (!inItemState) {
                    return false;
                }

                return Math.abs(requiredAmount - inItemState.amount) < 0.1;
            });

            return completedDependencies.length === dependencies.length;
        };

        if (checkCompletion()) {
            setStepDone(true);
        }
    }, [itemState, currentStep]);

    const value: PlaythroughContextShape = {
        error,
        recipe,
        selected,
        currentStep,
        stepDone,
        itemState,
        isLastStep,
        errorMarks,
        nextStep,
        replace: replaceItemState,
        select,
    };

    return (
        <PlaythroughContext.Provider
            value={ value }
        >
            { children }
        </PlaythroughContext.Provider>
    );
};

export default PlaythroughProvider;
