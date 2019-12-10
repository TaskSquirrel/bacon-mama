import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AxiosRequestConfig } from "axios";

import { APIRecipeResponse } from "../../../models/API";
import { Recipe, Step } from "../../../models/recipe";

import useLoadingIndicator from "../../hooks/useLoadingIndicator";
import useAPI from "../../hooks/useAPI";

import { fromAPIRecipe } from "../../../api/mappings";
import { noop } from "../../../utils";

export interface PlaythroughContextShape {
    error: boolean;
    recipe: Recipe | null;
    currentStep: Step | null;
    nextStep: () => void;
}

export const PlaythroughContextDefaultShape: PlaythroughContextShape = {
    error: false,
    recipe: null,
    currentStep: null,
    nextStep: noop,
};

export const PlaythroughContext = React.createContext<PlaythroughContextShape>(
    PlaythroughContextDefaultShape
);

const PlaythroughProvider: React.FC = ({ children }) => {
    const [error, setError] = useState<boolean>(false);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [currentStep, setCurrentStep] = useState<Step | null>(null);
    const { id: recipeID } = useParams();
    const { setStatus } = useLoadingIndicator();
    const request = useAPI();

    const doRequest = async (
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
    };

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

            setCurrentStep(
                steps.find(({ sequence: stepSeq }) => stepSeq === sequence + 1)
                || null
            );
        }
    };

    useEffect(() => {
        if (!recipe && !error) {
            fetchRecipe();
        }
    }, [error, recipe, fetchRecipe]);

    const value: PlaythroughContextShape = {
        error,
        recipe,
        currentStep,
        nextStep,
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
