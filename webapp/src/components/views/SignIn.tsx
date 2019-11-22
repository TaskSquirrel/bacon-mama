import React, { useState } from "react";
import { Link } from "react-router-dom";

import useUser from "../hooks/useUser";

import CenteredPane from "../CenteredPane";
import TextField from "../controls/TextField";
import ButtonBase from "../controls/ButtonBase";

import styles from "./SignIn.module.scss";
import requireSignedIn from "../shared/requireSignedIn";

const SignIn: React.FC = () => {
    const { signIn } = useUser();
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [done, setDone] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // Stop page from refreshing
        event.preventDefault();

        const login = async () => {
            try {
                signIn(name, password);
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
                        src="/assets/green-check.svg"
                    />
                    <div className={styles.message}>
                        You've successfully signed-in!
                    </div>
                    <ButtonBase>
                        <Link
                            to="/dashboard"
                        >
<<<<<<< HEAD
                            <div className={styles.link}>
                                Start Baking!
                            </div>
=======

                            Start Baking!
>>>>>>> 28640f4090cb7ee44fd4947953aa19a62a788184
                        </Link>
                    </ButtonBase>
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
                    { error }
                    <ButtonBase
                        type="submit"
                    >
                        Sign in
                    </ButtonBase>
                    <div
                        className={ styles.actions }
                    >
                        <Link
                            to="/forgot"
                        >
                            Forgot password?
                        </Link>
                        <Link
                            to="/sign-up"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </form>
        </CenteredPane>
    );
};

export default requireSignedIn(true)(SignIn);
