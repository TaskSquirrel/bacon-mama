import React, { useState, useEffect, useCallback } from "react";

import { APIRecipeList, APIClassList } from "../../../models/API";

import useAPI from "../../hooks/useAPI";
import useUser from "../../hooks/useUser";

import NavBar from "../../controls/NavBar";
import Card from "../../controls/Card";
import ClassCard from "../../controls/ClassCard";
import CreateClassModal from "./modals/CreateClassModal";

import styles from "./Class.module.scss";
import Responsive from "../../shared/Responsive";
import { APIManyClassResponse } from './../../../models/API';

const Class: React.FC = () => {
    const { name } = useUser();
    const [recipes, setRecipes] = useState<APIRecipeList[] | null>(null);
    const [create, setCreate] = useState<boolean>(false);
    const [createClass, setCreateClass] = useState<boolean>(false);
    const [classes, setClasses] = useState<APIClassList[] | null>(null);
    const [selectedClass, setSelectedClass] = useState<APIClassList | null>(null);
    const [students, setStudents] = useState<string[]  | null>(null);

    const request = useAPI();


    const getClasses = useCallback(async () => {
        const { data: {
            status,
            message,
            classes: responseClasses
        } } = await request<APIManyClassResponse>(
            "/getCourses",
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
            return responseClasses;
        }
    }, [request, name]);

    const updateClasses = async () => {
        try {
            if (!classes) {
                const responseClasses = await getClasses();

                setClasses(responseClasses.sort((a, b) => {
                    return a.id - b.id;
                }));
            }
        } catch (e) {
            // Error
        }
    };


    useEffect(() => {
        const updateClasses = async () => {
            try {
                if (!recipes) {
                    const responseClasses = await getClasses();

                    setClasses(responseClasses.sort((a, b) => {
                        return a.id - b.id;
                    }));
                }
            } catch (e) {
                // Error
            }
        };

        updateClasses();
    }, [getClasses, classes]);


    const setC = useCallback(() => {
        setCreate(true);
    }, [create]);

    const addClass = () => {
        if (!createClass) {
            return;
        }

        return (
            <CreateClassModal
                control={ setCreateClass }
                update={ updateClasses }
            />
        );
    }

    const toggleClass  = ()  => {
        setCreateClass(true);
    }

    const selectClass = (classes: APIClassList | null) => {
        if(classes){
            setSelectedClass(classes);
            setStudents(classes.students);
            setRecipes(classes.recipes);
        }
       
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
                    Your Courses
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
                            name={ each.name }
                            click={selectClass}
                            style={{backgroundColor: selectedClass ? selectedClass.name === each.name ? 'lightblue' : 'white' : 'white' }}
                        />
                    )) }

                    {<ClassCard add={toggleClass}/>}
                </div>

            </Responsive>
            <br />
            <Responsive>
                <div
                    className={ styles.title }
                >
                    Students In the Course
                </div>
                <div
                    className={ styles["card-container"] }
                >
                    { !students  && (
                        <div>
                            No Courses Selected!
                        </div>
                    ) }
                    { students && students.map((each) => (
                        <ClassCard
                            key={ each }
                            name={ each }
                        />
                    )) }

                    {selectedClass && <ClassCard add={toggleClass}/>}
                </div>

            </Responsive>
            <br />
            <Responsive>
                <div
                    className={ styles.title }
                >
                    Recipes In the Course
                </div>
                <div
                    className={ styles["card-container"] }
                >
                    { !recipes && (
                        <div>
                            No Courses Selected!
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
                    {selectedClass && <ClassCard add={toggleClass}/>}
                </div>
            </Responsive>
            { addClass() }
            
        </div>
    );
};

export default Class;
