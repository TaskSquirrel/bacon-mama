import React, { useState, useEffect, useCallback } from "react";

import { APIRecipeList, APIClassList, APIStudent } from "../../../models/API";

import useAPI from "../../hooks/useAPI";
import useUser from "../../hooks/useUser";

import NavBar from "../../controls/NavBar";
import Card from "../../controls/Card";
import ClassCard from "../../controls/ClassCard";
import CreateClassModal from "./modals/CreateClassModal";
import AddStudentModal from "./modals/AddStudentModal";



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
    const [students, setStudents] = useState<APIStudent[] | null>(null);
    const [addStudents, setAddStudents] = useState<boolean>(false);
    const [addRecipes, setaddRecipes] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(-1);

    const request = useAPI();


    const getClasses = useCallback(async () => {

        const { data: {
            status,
            message,
            courses: responseClasses
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

    const update = async () => {
        try {
            let responseClasses = await getClasses();
            
            responseClasses = responseClasses.sort((a, b) => {
                return a.id - b.id;
            })

            setClasses(responseClasses);

            if(selectedClass){
                setStudents(responseClasses[index].students.sort((a,b) => {
                    if(a.userName > b.userName){
                        return 1;
                    }
                    if(a.userName < b.userName){
                        return -1;
                    }
    
                    return 0;
                }));
                setRecipes(responseClasses[index].recipes.sort((a,b) => a.id-b.id));
            }
            

        } catch (e) {
            // Error
        }
    };


    useEffect(() => {
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
                control={setCreateClass}
                update={update}
            />
        );
    }

    const addStudentToCourse = () => {
        if (!addStudents) {
            return;
        }

        return (
            <AddStudentModal
                control={setAddStudents}
                update={update}
                info={'student'}
                course={selectedClass}
            />
        );
    }

    const addRecipesToCourse = () => {
        if (!addRecipes) {
            return;
        }

        return (
            <AddStudentModal
                control={setaddRecipes}
                update={update}
                info={'recipe'}
                course={selectedClass}
                
            />
        );
    }


    const selectClass = (i: number) => {
        if (classes) {
            setIndex(i);
            setSelectedClass(classes[i]);
            setStudents(classes[i].students.sort((a,b) => {
                if(a.userName > b.userName){
                    return 1;
                }
                if(a.userName < b.userName){
                    return -1;
                }

                return 0;
            }));
            setRecipes(classes[i].recipes.sort((a,b) => a.id-b.id));
        }

    }

    return (
        <div>
            <NavBar
                click={setC}
                userName={name || "User"}
            />
            <Responsive>
                <div
                    className={styles.title}
                >
                    Your Courses
                </div>
                <div
                    className={styles["card-container"]}
                >
                    {classes && classes.map((each, index) => (
                        <ClassCard
                            key={each.id}
                            index={index}
                            name={each.courseName}
                            click={selectClass}
                            color={selectedClass ? selectedClass.id === each.id ? 'lightblue' : 'white' : 'white'}
                        />
                    ))}

                    {<ClassCard add={ () => setCreateClass(true)} />}
                </div>

            </Responsive>
            <br />
            <Responsive>
                <div
                    className={styles.title}
                >
                    Students In the Course
                </div>
                <div
                    className={styles["card-container"]}
                >
                    {!students && (
                        <div>
                            No Courses Selected!
                        </div>
                    )}
                    {students && students.map((each) => (
                        <ClassCard
                            key={each.userName}
                            name={each.userName}
                        />
                    ))}

                    {selectedClass && <ClassCard add={() => setAddStudents(true)} />}
                </div>

            </Responsive>
            <br />
            <Responsive>
                <div
                    className={styles.title}
                >
                    Recipes In the Course
                </div>
                <div
                    className={styles["card-container"]}
                >
                    {!recipes && (
                        <div>
                            No Courses Selected!
                        </div>
                    )}
                    {recipes && recipes.map((each) => (
                        <Card
                            key={each.id}
                            id={`${each.id}`}
                            name={each.recipeName}
                            description={each.description}
                        />
                    ))}
                    {selectedClass && <ClassCard add={ () => setaddRecipes(true)} />}
                </div>
            </Responsive>
            {addClass()}
            {addStudentToCourse()}
            {addRecipesToCourse()}
        </div>
    );
};

export default Class;
