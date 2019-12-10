import React, { useState, useEffect, useCallback } from "react";

import { APIManyRecipeResponse, APIRecipeList, APIClassList } from "../../../models/API";

import useAPI from "../../hooks/useAPI";
import useUser from "../../hooks/useUser";

import NavBar from "../../controls/NavBar";
import Card from "../../controls/Card";
import ClassCard from "../../controls/ClassCard";
import CreateRecipeModal from "../home/CreateRecipeModal";

import styles from "./Class.module.scss";
import Responsive from "../../shared/Responsive";
import { APIManyClassResponse } from './../../../models/API';

const Class: React.FC = () => {
    const { name } = useUser();
    const [recipes, setRecipes] = useState<APIRecipeList[] | null>(null);
    const [create, setCreate] = useState<boolean>(false);
    const [createClass, setCreateClass] = useState<boolean>(false);
    const [classes, setClasses] = useState<APIClassList[] | null>(null);

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

    const getClasses = useCallback(async () => {
        const { data: {
            status,
            message,
            recipes: responseRecipes
        } } = await request<APIManyClassResponse>(
            "/getClasses",
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

    const updateRecipe = async () => {
        try {
            const responseRecipes = await getRecipes();
            setRecipes(responseRecipes.sort((a, b) => {
                return a.id - b.id;
            }));
        } catch (e) {
            // Error
        }
    };

    useEffect(() => {
        const updateClasses = async () => {
            try {
                if (!recipes) {
                    const responseRecipes = await getClasses();

                    setRecipes(responseRecipes.sort((a, b) => {
                        return a.id - b.id;
                    }));
                }
            } catch (e) {
                // Error
            }
        };

        updateClasses();
    }, [getClasses, classes]);

    const createRecipe = () => {
        if (!create) {
            return;
        }

        return (
            <CreateRecipeModal
                control={ setCreate }
                update={ updateRecipe }
            />
        );
    };

    const setC = useCallback(() => {
        setCreate(true);
    }, [create]);

    const addClass = () => {
        if (!createClass) {
            return;
        }

        return (
            <CreateRecipeModal
                control={ setCreateClass }
                update={ updateRecipe }
            />
        );
    }

    const toggleClass  = ()  => {
        setCreateClass(true);
    }

    const selectClass = () => {
        
    }

    return (
        <div>
            <NavBar
                click={ setC }
                userName={ name || "User" }
            />
            <Responsive>
                <div
                    className={ styles.title }
                >
                    Your Classes
                </div>
                <div
                    className={ styles["card-container"] }
                >
                    { classes && classes.length === 0 && (
                        <div>
                            No classes found!
                        </div>
                    ) }
                    { classes && classes.map((each) => (
                        <ClassCard
                            key={ each.id }
                            id={ `${each.id}` }
                            name={ each.recipeName }
                            description={ each.description }
                            click={selectClass}
                        />
                    )) }

                    {<ClassCard click={toggleClass}/>}
                </div>

            </Responsive>
            <Responsive>
                <div
                    className={ styles.title }
                >
                    Your Recipes
                </div>
                <div
                    className={ styles["card-container"] }
                >
                    { recipes && recipes.length === 0 && (
                        <div>
                            No recipes found!
                        </div>
                    ) }
                    { recipes && recipes.map((each) => (
                        <Card
                            key={ each.id }
                            id={ `${each.id}` }
                            name={ each.recipeName }
                            description={ each.description }
                        />
                    )) }
                </div>
            </Responsive>
            { createRecipe() }
            { addClass() }
        </div>
    );
};

export default Class;
