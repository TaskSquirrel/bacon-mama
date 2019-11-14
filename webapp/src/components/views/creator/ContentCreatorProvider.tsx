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

import AddItem from "./AddItem";
import EditStep from "./EditStep";
import useAPI from "../../hooks/useAPI";

import { fromAPIRecipe } from "../../../api/mappings";
import { noop } from "../../../utils";

export interface ContentCreatorContextShape {
    available: boolean;
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
                        id, name, verb, sequence,
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
    }, [recipe, updateRecipe]);

    const value: ContentCreatorContextShape = recipe
        ? {
            available: true,
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
        : DEFAULT_CONTENT_CREATOR_CONTEXT;

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
