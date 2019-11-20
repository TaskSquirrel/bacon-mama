import React, { useState, useEffect } from "react";
import NavBar from "../controls/NavBar";
import styles from "./Dashboard.module.scss";
import useAPI from "../hooks/useAPI";
import { AxiosRequestConfig } from 'axios';
import { APIManyRecipeResponse, APIRecipeList } from './../../models/API';
import { Recipe } from './../../models/recipe';
import Card from "../controls/Card";

const Dashboard: React.FC = () => {
    
    // Get recipe from user
    // Recipe
    // {
    // recipe name, recipeID, description
    // }

    const [recipe, setRecipe] = useState<APIRecipeList[] | null>(null);

    const request = useAPI();

    const doRequest = async (
        endpoint: string,
        payload: AxiosRequestConfig
    ) => {
        try {
            const {
                data
            } = await request<APIManyRecipeResponse>(
                endpoint,
                payload
            );
            
            console.log(data);
            

            const { status, message, recipes: responseRecipe } = data;

            if (status === "OK") {
                setRecipe(responseRecipe);
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
            
        }
    };

    const getRecipes = () => {
        doRequest(
            "/getRecipes",
            {
                method: "POST",
                data: {
                    username: 'aa'
                }
            }
        );
    }

    useEffect(() => {
        if(!recipe){
            getRecipes();
        }
    }, [])

    return(
        <div>
            <NavBar className={ styles.navbar } userName={ "Ben" } />
            {recipe && recipe.map((each) => (
                <Card key={each.id} name={each.recipeName} description={each.description} />    
            ))}
        </div>
    );
};

export default Dashboard;
