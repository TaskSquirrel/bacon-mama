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

import ItemPickerModal from "./items/ItemPickerModal";
import AddItem from "./AddItem";
import EditStep from "./EditStep";
import useLoadingIndicator from "../../hooks/useLoadingIndicator";
import useAPI from "../../hooks/useAPI";

import { fromAPIRecipe } from "../../../api/mappings";
import { noop } from "../../../utils";

export interface ContentCreatorContextShape {
    available: boolean;
    metadata: Metadata;
    currentStep: Step | null;
    items: Item[];
    steps: Step[];
    actions: {
        setSelectItemModal: (state: boolean) => void,
        setAddItemModal: (state: boolean) => void,
        setEditStepModal: (state: boolean) => void,
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
    currentStep: null,
    items: [],
    steps: [],
    actions: {
        setSelectItemModal: noop,
        setAddItemModal: noop,
        setEditStepModal: noop,
        addItem: noop,
        addStep: noop,
        replaceStep: noop
    }
};

export const ContentCreatorContext = React.createContext<
    ContentCreatorContextShape
>(DEFAULT_CONTENT_CREATOR_CONTEXT);

const ContentCreatorProvider: React.FC = ({ children }) => {
    const [selectedItemModal, setSelectedItemModal] = useState<boolean>(false);
    const [addItemModal, setAddItemModal] = useState<boolean>(false);
    const [editStepModal, setEditStepModal] = useState<boolean>(false);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { id: recipeID, sequence: seq } = useParams();
    const request = useAPI();
    const { setStatus } = useLoadingIndicator();
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

    const doRequest = async (
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

    const renderSelectItemModal = () => {
        if (!selectedItemModal || !currentStep || !recipe) {
            return null;
        }

        return (
            <ItemPickerModal
                items={ recipe.items }
                control={ createModalStateSetter(setSelectedItemModal) }
            />
        );
    };

    const renderAddItemModal = () => {
        if (!addItemModal) {
            return null;
        }

        return (
            <AddItem
                control={ createModalStateSetter(setAddItemModal) }
            />
        );
    };

    const renderEditStep = () => {
        if (!currentStep || !editStepModal) {
            return null;
        }

        return (
            <EditStep
                step={ currentStep }
                control={ createModalStateSetter(setEditStepModal) }
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
            currentStep: currentStep || null,
            items: recipe.items,
            steps: recipe.steps,
            actions: {
                setSelectItemModal: createModalStateSetter(setSelectedItemModal),
                setAddItemModal: createModalStateSetter(setAddItemModal),
                setEditStepModal: createModalStateSetter(setEditStepModal),
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
                { renderSelectItemModal() }
                { renderAddItemModal() }
                { renderEditStep() }
            </ContentCreatorContext.Provider>
        </>
    );
};

export default ContentCreatorProvider;
