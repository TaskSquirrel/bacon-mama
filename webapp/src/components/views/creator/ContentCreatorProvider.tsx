import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AxiosRequestConfig } from "axios";

import {
    Step,
    Item,
    Metadata,
    Recipe
} from "../../../models/recipe";
import { APIRecipeResponse, Omit } from "../../../models/API";

import EditStep from "./EditStep";
import useAPI from "../../hooks/useAPI";

import { noop } from "../../../utils";
import { toRecipe } from "../../../utils/recipe";
import AddItem from "./AddItem";

export interface ContentCreatorContextShape {
    available: boolean;
    error: string | null;
    metadata: Metadata;
    items: Item[];
    steps: Step[];
    actions: {
        openAddItem: () => void,
        openEditStep: () => void,
        addItem: (name: string, description?: string) => Promise<void> | void,
        addStep: (step: Omit<Step, "id">) => Promise<void> | void,
        replaceStep: (step: Step) => Promise<void> | void
    };
}

export const DEFAULT_CONTENT_CREATOR_CONTEXT: ContentCreatorContextShape = {
    available: false,
    error: null,
    metadata: {
        id: "content_creator",
        name: "Untitled recipe"
    },
    items: [],
    steps: [],
    actions: {
        openAddItem: noop,
        openEditStep: noop,
        addItem: noop,
        addStep: noop,
        replaceStep: noop
    }
};

export const ContentCreatorContext = React.createContext<
    ContentCreatorContextShape
>(DEFAULT_CONTENT_CREATOR_CONTEXT);

const ContentCreatorProvider: React.FC = ({ children }) => {
    const [error, setError] = useState<string | null>(null);
    const [addItemModal, setAddItemModal] = useState<boolean>(false);
    const [editStep, setEditStep] = useState<boolean>(false);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { id: recipeID, sequence: seq } = useParams();
    const request = useAPI();

    const createModalStateSetter = (
        state: boolean,
        setter: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        return () => {
            setter(state);
        };
    };

    const openAddItem = createModalStateSetter(
        true, setAddItemModal
    );

    const openEditStep = createModalStateSetter(
        true, setEditStep
    );

    const doRequest = async (
        endpoint: string,
        payload: AxiosRequestConfig
    ) => {
        try {
            const {
                data
            } = await request<APIRecipeResponse>(
                endpoint,
                payload
            );

            const { status, message } = data;

            if (status === "OK") {
                setError(null);
                setRecipe(toRecipe(data));
            } else {
                throw new Error(message);
            }
        } catch (e) {
            setError(e.message);
        }
    };

    const addItem = (
        name: string,
        description?: string
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
                        description
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
            "/addSteps",
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
        id, name, verb, sequence, dependencies, result: creates, description
    }: Step) => {
        doRequest(
            "/editStep",
            {
                data: {
                    recipe: {
                        id: recipeID
                    },
                    step: {
                        id, name, verb, sequence, dependencies, creates,
                        description
                    }
                }
            }
        );
    };

    const updateRecipe = () => {
        doRequest(
            "/getRecipe",
            {
                method: "POST",
                data: {
                    id: recipeID
                }
            }
        );
    };

    const renderAddItemModal = () => {
        return (
            <AddItem
                show={ addItemModal }
                close={ createModalStateSetter(false, setAddItemModal) }
            />
        );
    };

    const renderEditStep = () => {
        if (!seq || !recipe) {
            return null;
        }

        const step = recipe.steps
            .find(({ sequence }) => `${sequence}` === seq);

        if (!step) {
            return null;
        }

        return (
            <EditStep
                show={ editStep }
                step={ step }
                close={ createModalStateSetter(false, setEditStep) }
            />
        );
    };

    useEffect(() => {
        // On mount fetch recipe

        if (!recipe) {
            updateRecipe();
        }
    }, []);

    const value: ContentCreatorContextShape = recipe
        ? {
            available: true,
            error,
            metadata: {
                id: recipe.id,
                name: recipe.name,
                description: recipe.description
            },
            items: recipe.items,
            steps: recipe.steps,
            actions: {
                openAddItem,
                openEditStep,
                addItem, addStep, replaceStep
            }
        }
        : { ...DEFAULT_CONTENT_CREATOR_CONTEXT, actions: {
            ...DEFAULT_CONTENT_CREATOR_CONTEXT.actions,
            openEditStep
        } };

    return (
        <>
            <ContentCreatorContext.Provider
                value={ value }
            >
                { children }
                { renderAddItemModal() }
                { renderEditStep() }
            </ContentCreatorContext.Provider>
        </>
    );
};

export default ContentCreatorProvider;
