import React, { useState, useEffect, useCallback } from "react";

import { APIManyRecipeResponse, APIRecipeList } from "../../../models/API";

import useAPI from "../../hooks/useAPI";
import useUser from "../../hooks/useUser";

import Responsive from "../../shared/Responsive";
import NavBar from "../../controls/NavBar";
import Card from "./Card";
import CreateRecipeModal from "../home/CreateRecipeModal";
import ConfirmationModal from "../creator/modals/ConfirmationModal";

import styles from "./Dashboard.module.scss";

export interface ConfirmationModalState {
    show: boolean;
    recipeID: string | null;
}

const Dashboard: React.FC = () => {
    const { name, role } = useUser();
    const [recipes, setRecipes] = useState<APIRecipeList[] | null>(null);
    const [create, setCreate] = useState<boolean>(false);
    const [confirmationState, setConfirmationState] = useState<
        ConfirmationModalState
    >({ show: false, recipeID: null });
    const request = useAPI();

    const isStudent = role === "student";

    const update = useCallback(async () => {
        try {
            const {
                data: { status, message, recipes: responseRecipes }
            } = await request<APIManyRecipeResponse>("/getRecipes", {
                method: "POST",
                data: {
                    username: name
                }
            });

            if (status === "OK") {
                setRecipes(
                    responseRecipes.sort((a, b) => {
                        return a.id - b.id;
                    })
                );
            } else {
                throw new Error(message);
            }
        } catch (e) {
            // Error
        }
    }, [name, request]);

    const removeRecipe = useCallback(
        async (id: string) => {
            const {
                data: { status, message }
            } = await request("/deleteRecipe", {
                method: "POST",
                data: {
                    recipe: { id: parseInt(id) }
                }
            });

            if (status === "error") {
                throw new Error(message);
            } else {
                update();
            }
        },
        [request, update]
    );

    const confirmationAction = (action: boolean) => {
        const { recipeID } = confirmationState;

        if (action && recipeID) {
            removeRecipe(recipeID);
        }

        setConfirmationState({ show: false, recipeID: null });
    };

    const renderCreateRecipe = () => {
        if (!create) {
            return;
        }

        return (
            <CreateRecipeModal control={ setCreate } update={ update } />
        );
    };

    const renderConfirmationModal = () => {
        const { show } = confirmationState;

        if (!show) {
            return null;
        }

        return (
            <ConfirmationModal
                show
                title="Delete recipe?"
                prompt="Really delete this recipe?"
                cancelText="No"
                actionText="Yes"
                onAction={ confirmationAction }
            />
        );
    };

    const setC = () => setCreate(true);

    useEffect(() => {
        if (recipes === null) {
            update();
        }
    }, [recipes, update]);

    return (
        <div>
            <NavBar click={ setC } userName={ name || "User" } role={ role } />
            <Responsive>
                <div
                    className={ styles.title }
                >
                    { isStudent
                        ? "Assigned Recipes"
                        : "Your Recipes" }
                </div>
                { recipes && recipes.length > 0
                    ? (
                        <div className={ styles["card-container"] }>
                            { recipes.map((each) => {
                                let showStatus: "complete" | "incomplete" | null = null;

                                const updateConfirmationState = () => {
                                    setConfirmationState({
                                        show: true,
                                        recipeID: `${each.id}`
                                    });
                                };

                                if (isStudent) {
                                    showStatus = each.status
                                        ? "complete"
                                        : "incomplete";
                                }

                                return (
                                    <Card
                                        key={ each.id }
                                        id={ `${each.id}` }
                                        name={ each.recipeName }
                                        description={ each.description }
                                        role={ role }
                                        status={ showStatus || undefined }
                                        onButtonClick={ updateConfirmationState }
                                    />
                                );
                            }) }
                        </div>
                    )
                    : (
                        <div>
                            No recipes to show!
                        </div>
                    ) }
            </Responsive>
            { renderCreateRecipe() }
            { renderConfirmationModal() }
        </div>
    );
};

export default Dashboard;
