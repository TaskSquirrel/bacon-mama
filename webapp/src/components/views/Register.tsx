import React, { useState } from "react";
import { Link } from "react-router-dom";

import CenteredPane from "../CenteredPane";
import TextField from "../controls/TextField";
import ButtonBase from "../controls/ButtonBase";

import APIClient from "../../api/APIClient";

import styles from "./Register.module.scss";

const Register: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [done, setDone] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setName(event.target.value);
    };

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (password2 !== event.target.value) {
            setError("Passwords do not match!");
        } else {
            setError(null);
        }

        setPassword(event.target.value);
    };

    const onPasswordChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (password !== event.target.value) {
            setError("Passwords do not match!");
        } else {
            setError(null);
        }
        setPassword2(event.target.value);
    };

    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // Stop page from refreshing
        event.preventDefault();

        if (error) {
            return;
        }

        const login = async () => {
            try {
                const { data: {
                    status,
                    message: errorMessage
                } } = await APIClient.request(
                    "/addUser",
                    {
                        method: "POST",
                        data: {
                            username: name,
                            password,
                            role
                        }
                    }
                );

                if (status === "OK") {
                    setError(null);
                } else {
                    throw new Error(errorMessage);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setDone(true);
            }
        };

        login();
    };

    if (done && !error) {
        return (
            <CenteredPane>
                <div
                    className={ styles.stack }
                >
                    <img
                        alt="Done"
                        src="/assets/green-check.svg"
                    />
                    <div className={ styles.message }>
                        You've successfully signed-up!
                    </div>
                    <Link
                        to="/sign-in"
                    >
                        <ButtonBase
                            className={ styles.link }
                        >
                            Sign-in
                        </ButtonBase>
                    </Link>
                </div>
            </CenteredPane>
        );
    }

    return (
        <CenteredPane>
            <form
                onSubmit={ onFormSubmit }
            >
                <div
                    className={ styles.form }
                >
                    <TextField
                        required
                        type="text"
                        placeholder="Username"
                        value={ name }
                        onChange={ onNameChange }
                    />
                    <TextField
                        required
                        type="password"
                        placeholder="Password"
                        value={ password }
                        onChange={ onPasswordChange }
                    />
                    <TextField
                        required
                        type="password"
                        placeholder="Repeat Password"
                        value={ password2 }
                        onChange={ onPasswordChange2 }
                    />
                    <div>
                        <div
                            className={ styles.question }
                        >
                            Are you a...
                        </div>
                        <div
                            className={ styles.roles }
                        >
                            <div
                                className={ styles.choice }
                            >
                                <input
                                    required
                                    type="radio"
                                    id="role-student"
                                    name="role"
                                    value="student"
                                    onChange={ () => setRole("student") }
                                />
                                <label
                                    htmlFor="role-student"
                                >
                                    Student
                                </label>
                            </div>
                            <div
                                className={ styles.choice }
                            >
                                <input
                                    required
                                    type="radio"
                                    id="role-chef"
                                    name="role"
                                    value="professor"
                                    onChange={ () => setRole("professor") }
                                />
                                <label
                                    htmlFor="role-chef"
                                >
                                    Professor
                                </label>
                            </div>
                        </div>
                    </div>
                    { error && (
                        <div>
                            { error }
                        </div>
                    ) }
                    <ButtonBase
                        type="submit"
                    >
                        Register
                    </ButtonBase>
                    <div
                        className={ styles.actions }
                    >
                        <Link
                            to="/sign-in"
                        >

                            Sign-in Instead
                        </Link>
                    </div>
                </div>
            </form>
        </CenteredPane>
    );
};

export default Register;
