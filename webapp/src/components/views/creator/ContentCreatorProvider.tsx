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

export interface ContentCreatorContextShape {
    available: boolean;
    error: string | null;
    metadata: Metadata;
    items: Item[];
    steps: Step[];
    actions: {
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
    steps: [
        {
            id: "",
            name: "Bake cake",
            description: "LOL",
            dependencies: [],
            creates: "",
            verb: "LOL",
            sequence: 0
        }
    ],
    actions: {
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

    const openEditStep = createModalStateSetter(
        true, setEditStep
    );

    const doRequest = async (
        endpoint: string,
        payload: AxiosRequestConfig
    ) => {
        try {
            const {
                data: {
                    status, message, recipe: recipeResponse
                }
            } = await request<APIRecipeResponse>(
                endpoint,
                payload
            );

            if (status === "OK") {
                setError(null);
                setRecipe(recipeResponse);
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
                        id: recipeID,
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
            name, verb, sequence, dependencies, creates, description
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
                        name, verb, sequence, dependencies, creates,
                        description
                    }
                }
            }
        );
    };

    const replaceStep = ({
        id, name, verb, sequence, dependencies, creates, description
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
                data: {
                    id: recipeID
                }
            }
        );
    };

    const renderEditStep = () => {
        if (!seq) {
            return null;
        }

        const step = DEFAULT_CONTENT_CREATOR_CONTEXT.steps
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
                { renderEditStep() }
            </ContentCreatorContext.Provider>
        </>
    );
};

export default ContentCreatorProvider;
