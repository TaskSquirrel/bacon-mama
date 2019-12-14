import React, { useState, useEffect, useCallback } from "react";

import { APIRecipeList, APIClassList, APIStudent, APIManyRecipeResponse } from "../../../models/API";

import useAPI from "../../hooks/useAPI";
import useUser from "../../hooks/useUser";

import NavBar from "../../controls/NavBar";
import ClassCard from "../../controls/ClassCard";
import CreateClassModal from "./modals/CreateClassModal";
import AddStudentModal from "./modals/AddStudentModal";



import styles from "./Class.module.scss";
import Responsive from "../../shared/Responsive";
import { APIManyClassResponse, APIClassResponse } from './../../../models/API';
import { Recipe } from './../../../models/recipe';
import CreateRecipeModal from './../home/CreateRecipeModal';
import Card from "../dashboard/Card";
import StudentCard from "../../controls/StudentCard";

interface Options {
    key:number,
    text: string,
    value: number
}

const Class: React.FC = () => {
    const { name, role } = useUser();
    const [recipes, setRecipes] = useState<APIRecipeList[] | null>(null);
    const [create, setCreate] = useState<boolean>(false);
    const [createClass, setCreateClass] = useState<boolean>(false);
    const [classes, setClasses] = useState<APIClassList[] | null>(null);
    const [selectedClass, setSelectedClass] = useState<APIClassList | null>(null);
    const [students, setStudents] = useState<APIStudent[] | null>(null);
    const [addStudents, setAddStudents] = useState<boolean>(false);
    const [addRecipes, setaddRecipes] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(-1);
    const [studentOptions, setStudentOptions] = useState<Options[]| null>(null);
    const [recipeOptions, setRecipeOptions] = useState<Options[]| null>(null);

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

    const getStudents = useCallback(async () => {
        
        const { data: {
            status,
            message,
            students
        } } = await request(
            "/getAllStudents",
            {
                method: "POST",
                data: {}
            }
        );


        if (status === "error") {
            throw new Error(message);
        } else {

            return students;
        }
    }, []);

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
                    username: name,
                    
                }
            }
        );


        if (status === "error") {
            throw new Error(message);
        } else {

            return responseRecipes;
        }
    }, []);

    const updateOptions = async () => {
        try {
            if (recipes) {
                const responseRecipes = await getRecipes();
                
                const op: Options[] = responseRecipes.map((item) => {
                    return {key:item.id, text:item.recipeName, value:item.id};
                }).filter((item) => {
                    return !recipes.some((recipe) => recipe.id === item.value);
                });

                setRecipeOptions(op);
            }
            if(students){
                const responseStudents = await getStudents();

                const op: Options[] = responseStudents.map((item:any) => {
                    return {key:item.username, text:item.username, value:item.username};
                }).filter((item: any) => {
                    return !students.some((student) => student.userName === item.value);               
                });


                setStudentOptions(op);
            }
        } catch (e) {
            // Error
        }
    };

    useEffect(() => {
        updateOptions();
    },[selectedClass, recipes, students]);


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
                options={studentOptions}
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
                options={recipeOptions}
            />
        );
    }

    const createRecipe = () => {
        if (!create) {
            return;
        }

        return (
            <CreateRecipeModal
                control={ setCreate }
                update={ update }
            />
        );
    };

    const setC = useCallback(() => {
        setCreate(true);
    }, [create]);


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

    const removeStudentFromCourse = useCallback(async (username: string) => {

        const { data: {
            status,
            message,
            course: responseClasses
        } } = await request<APIClassResponse>(
            "/removeStudentFromCourse",
            {
                method: "POST",
                data: {
                    username: username,
                    course: selectedClass
                }
            }
        );


        if (status === "error") {
            throw new Error(message);
        } else {
            setSelectedClass(responseClasses);
            update();
        }
    }, [request, name]);

    const removeClassFromCourse = useCallback(async (courseID: number) => {

        const { data: {
            status,
            message,
        } } = await request(
            "/removeCourse",
            {
                method: "POST",
                data: {
                    id: courseID
                }
            }
        );


        if (status === "error") {
            throw new Error(message);
        } else {
            setSelectedClass(null);
            setStudents(null);
            setRecipes(null);
            update();
        }
    }, [request, name]);

    const removeRecipeFromCourse = useCallback(async (id:string) => {
        const { data: {
            status,
            message,
        } } = await request(
            "/removeRecipeFromCourse",
            {
                method: "POST",
                data: {
                    recipe: {id},
                    course: {id:selectedClass ? selectedClass.id : ''}
                }
            }
        );

        if (status === "error") {
            throw new Error(message);
        } else {
            update();
        }
    }, [request, name]);

    return (
        <div>
            <NavBar
                click={setC}
                userName={name || "User"}
                role={role}
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
                            classid={each.id}
                            name={each.courseName}
                            click={selectClass}
                            remove={removeClassFromCourse}
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
                        <StudentCard
                            key={each.userName}
                            name={each.userName}
                            remove={removeStudentFromCourse}
                        />
                    ))}

                    {selectedClass && <StudentCard add={() => setAddStudents(true)} />}
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
                    className={styles["card-container2"]}
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
                            remove={removeRecipeFromCourse}
                            role={role}
                        />
                    ))}
                    {selectedClass && <ClassCard add={ () => setaddRecipes(true)} />}
                </div>
            </Responsive>
            {addClass()}
            {addStudentToCourse()}
            {addRecipesToCourse()}
            {createRecipe()}
        </div>
    );
};

export default Class;
