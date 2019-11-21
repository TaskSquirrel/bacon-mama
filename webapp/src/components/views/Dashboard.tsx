import React, { useState, useEffect, useCallback } from "react";

import { APIManyRecipeResponse, APIRecipeList } from "./../../models/API";

import useAPI from "../hooks/useAPI";
import useUser from "../hooks/useUser";

import NavBar from "../controls/NavBar";
import Card from "../controls/Card";

import styles from "./Dashboard.module.scss";

const Dashboard: React.FC = () => {
    const { name } = useUser();
    const [recipes, setRecipes] = useState<APIRecipeList[] | null>(null);

    const request = useAPI();

    const getRecipes = useCallback(async () => {
        const { data: {
            status,
            message,
            recipes: responseRecipes
        } } = await request<APIManyRecipeResponse>(
            "/getRecipes",
            {
                method: "POST",
                data: {
                    username: name
                }
            }
        );

        if (status === "error") {
            throw new Error(message);
        } else {
            return responseRecipes;
        }
    }, [request, name]);

    useEffect(() => {
        const updateRecipes = async () => {
            try {
                if (!recipes) {
                    const responseRecipes = await getRecipes();

                    setRecipes(responseRecipes);
                }
            } catch (e) {
                // Error
            }
        };

        updateRecipes();
    }, [getRecipes, recipes]);

    return (
        <div>
            <NavBar className={ styles.navbar } userName={ "Ben" } />
            <div className={ styles.title }>Your Recipes</div>
            <div className={ styles.card }>
                { recipes && recipes.map((each) => (
                    <Card
                        key={ each.id }
                        id={ `${each.id}` }
                        name={ each.recipeName }
                        description={ each.description }
                    />
                )) }
            </div>
        </div>
    );
};

export default Dashboard;
