import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouteMatch } from "react-router";
import { AxiosRequestConfig } from "axios";

import {
    Step,
    Item,
    Metadata,
    Recipe
} from "../../../models/recipe";
import { APIRecipeResponse } from "../../../models/API";

import RecipeDetailsModal from "./modals/RecipeDetailsModal";
import ItemPickerModal from "./modals/ItemPickerModal";
import AddItemModal from "./modals/AddItemModal";
import EditStepModal from "./modals/EditStepModal";
import useLoadingIndicator from "../../hooks/useLoadingIndicator";
import useAPI from "../../hooks/useAPI";

import { fromAPIRecipe } from "../../../api/mappings";
import { noop } from "../../../utils";

export interface ContentCreatorContextShape {
    error: boolean;
    available: boolean;
    metadata: Metadata;
    currentStep: Step | null;
    items: Item[];
    steps: Step[];
    actions: {
        setRecipeModal: (state: boolean) => void,
        setAddItemModal: (state: boolean) => void,
        setEditStepModal: (state: boolean) => void,
        addItem: (
            name: string, description?: string, imageID?: number | string | null
        ) => Promise<void> | void,
        addStep: (step: Omit<Step, "id">) => Promise<void> | void,
        replaceStep: (step: Step) => Promise<void> | void,
        deleteStep: (stepID: string) => Promise<void> | void,
        replaceRecipe: (name: string, description?: string) => Promise<void> | void,
    };
}

export const DEFAULT_CONTENT_CREATOR_CONTEXT: ContentCreatorContextShape = {
    error: false,
    available: false,
    metadata: {
        id: "content_creator",
        name: "Untitled recipe"
    },
    currentStep: null,
    items: [],
    steps: [],
    actions: {
        setRecipeModal: noop,
        setAddItemModal: noop,
        setEditStepModal: noop,
        addItem: noop,
        addStep: noop,
        replaceStep: noop,
        deleteStep: noop,
        replaceRecipe: noop,
    }
};

export const ContentCreatorContext = React.createContext<
    ContentCreatorContextShape
>(DEFAULT_CONTENT_CREATOR_CONTEXT);

const ContentCreatorProvider: React.FC = ({ children }) => {
    const [error, setError] = useState<boolean>(false);
    const [recipeModal, setRecipeModal] = useState<boolean>(false);
    const [addItemModal, setAddItemModal] = useState<boolean>(false);
    const [editStepModal, setEditStepModal] = useState<boolean>(false);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { id: recipeID, sequence: seq } = useParams();
    const request = useAPI();
    const { setStatus } = useLoadingIndicator();
    const showDependencyPicker = useRouteMatch({
        path: "/edit/:id/:sequence/deps",
        exact: true
    });
    const showResultPicker = useRouteMatch({
        path: "/edit/:id/:sequence/creates",
        exact: true
    });

    const currentStep = recipe && seq
        ? recipe.steps.find(
            ({ sequence: recipeStepSeq }) => seq === `${recipeStepSeq}`
        )
        : null;

    const createModalStateSetter = (
        setter: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        return (state: boolean) => {
            setter(state);
        };
    };

    const doRequest = useCallback(async (
        endpoint: string,
        payload: AxiosRequestConfig
    ) => {
        try {
            setStatus(true);

            const {
                data
            } = await request<APIRecipeResponse>(
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
                throw new Error("Network request failed!");
            } else {
                throw e;
            }
        } finally {
            setStatus(false);
        }
    }, [request, setStatus]);

    const addItem = (
        name: string,
        description?: string,
        imageID?: number | string | null
    ) => {
        doRequest(
            "/addItem",
            {
                method: "POST",
                data: {
                    recipe: {
                        id: recipeID
                    },
                    item: {
                        name,
                        description,
                        image: imageID,
                    }
                }
            }
        );
    };

    const addStep = (step: Omit<Step, "id">) => {
        const {
            name, verb, sequence, dependencies, result, description
        } = step;

        doRequest(
            "/addStep",
            {
                method: "POST",
                data: {
                    recipe: {
                        id: recipeID
                    },
                    step: {
                        itemName: name,
                        verb,
                        sequence,
                        dependencies,
                        result: result ? {
                            id: result
                        } : null,
                        description
                    }
                }
            }
        );
    };

    const replaceStep = ({
        id, name, verb, sequence, dependencies, result, description
    }: Step) => {
        doRequest(
            "/editStep",
            {
                method: "POST",
                data: {
                    recipe: {
                        id: recipeID
                    },
                    step: {
                        id, verb, sequence,
                        title: name,
                        dependencies,
                        result: result || null,
                        description
                    }
                }
            }
        );
    };

    const deleteStep = (stepID: string) => {
        doRequest(
            "/deleteStep",
            {
                method: "POST",
                data: {
                    recipe: {
                        id: recipeID
                    },
                    step: {
                        id: stepID
                    }
                }
            }
        );
    };

    const replaceRecipe = async (name: string, description?: string) => {
        doRequest(
            "/editRecipe",
            {
                method: "POST",
                data: {
                    recipe: {
                        id: recipeID
                    },
                    replace: {
                        recipeName: name,
                        description
                    }
                }
            }
        );
    };

    const renderRecipeModal = () => {
        if (!recipe || !recipeModal) {
            return null;
        }

        return (
            <RecipeDetailsModal
                control={ createModalStateSetter(setRecipeModal) }
            />
        );
    };

    const renderSelectItemModal = () => {
        if (!recipe || !currentStep) {
            return null;
        }

        const pick = showDependencyPicker
            ? "dependencies"
            : "result";

        return (
            <ItemPickerModal
                pick={ pick }
                show={ !!showDependencyPicker || !!showResultPicker }
                items={ recipe.items }
                currentStep={ currentStep }
            />
        );
    };

    const renderAddItemModal = () => {
        if (!addItemModal) {
            return null;
        }

        return (
            <AddItemModal
                control={ createModalStateSetter(setAddItemModal) }
            />
        );
    };

    const renderEditStep = () => {
        if (!currentStep || !editStepModal) {
            return null;
        }

        return (
            <EditStepModal
                step={ currentStep }
                control={ createModalStateSetter(setEditStepModal) }
            />
        );
    };

    useEffect(() => {
        // On mount fetch recipe

        if (!recipe && !error) {
            const updateRecipe = async () => {
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

            updateRecipe();
        }
    }, [doRequest, error, recipe, recipeID]);

    const value: ContentCreatorContextShape = recipe
        ? {
            error,
            available: true,
            metadata: {
                id: recipe.id,
                name: recipe.name,
                description: recipe.description
            },
            currentStep: currentStep || null,
            items: recipe.items,
            steps: recipe.steps,
            actions: {
                setRecipeModal: createModalStateSetter(setRecipeModal),
                setAddItemModal: createModalStateSetter(setAddItemModal),
                setEditStepModal: createModalStateSetter(setEditStepModal),
                addItem, addStep, replaceStep, deleteStep,
                replaceRecipe,
            }
        }
        : {
            ...DEFAULT_CONTENT_CREATOR_CONTEXT,
            error
        };

    return (
        <>
            <ContentCreatorContext.Provider
                value={ value }
            >
                { children }
                { renderRecipeModal() }
                { renderSelectItemModal() }
                { renderAddItemModal() }
                { renderEditStep() }
            </ContentCreatorContext.Provider>
        </>
    );
};

export default ContentCreatorProvider;
