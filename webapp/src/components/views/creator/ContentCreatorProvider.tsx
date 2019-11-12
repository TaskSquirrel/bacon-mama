import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AxiosRequestConfig } from "axios";

import {
    Step,
    Item,
    Metadata,
    Recipe
} from "../../../models/recipe";
import { APIRecipeResponse } from "../../../models/API";

import useAPI from "../../hooks/useAPI";

import { noop } from "../../../utils";

export interface ContentCreatorContextShape {
    available: boolean;
    error: string | null;
    metadata: Metadata;
    items: Item[];
    steps: Step[];
    actions: {
        addItem: (name: string, description?: string) => Promise<void> | void,
        addStep: (
            name: string,
            verb: string,
            sequence: number,
            dependencies: string[],
            creates: string,
            description?: string
        ) => Promise<void> | void
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
        addItem: noop,
        addStep: noop
    }
};

export const ContentCreatorContext = React.createContext<
    ContentCreatorContextShape
>(DEFAULT_CONTENT_CREATOR_CONTEXT);

const ContentCreatorProvider: React.FC = ({ children }) => {
    const [error, setError] = useState<string | null>(null);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { id: recipeID } = useParams();
    const request = useAPI();

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
                    id: recipeID,
                    item: {
                        name,
                        description
                    }
                }
            }
        );
    };

    const addStep = (
        name: string,
        verb: string,
        sequence: number,
        dependencies: string[],
        creates: string,
        description?: string
    ) => {
        doRequest(
            "/addStep",
            {
                method: "POST",
                data: {
                    id: recipeID,
                    step: {
                        name, verb, sequence, dependencies, creates,
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
                addItem, addStep
            }
        }
        : DEFAULT_CONTENT_CREATOR_CONTEXT;

    return (
        <ContentCreatorContext.Provider
            value={ value }
        >
            { children }
        </ContentCreatorContext.Provider>
    );
};

export default ContentCreatorProvider;
