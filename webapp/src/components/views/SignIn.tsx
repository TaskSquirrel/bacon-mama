import React, { useState } from "react";
import { Link } from "react-router-dom";

import useUser from "../hooks/useUser";

import CenteredPane from "../CenteredPane";
import TextField from "../controls/TextField";
import ButtonBase from "../controls/ButtonBase";
import Spinner from "../shared/Spinner";
import useLoadingIndicator from "../hooks/useLoadingIndicator";

import { randomRange } from "../../utils";

import styles from "./SignIn.module.scss";

const SignIn: React.FC = () => {
    const { status, setStatus } = useLoadingIndicator();
    const { signIn } = useUser();
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
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
                await signIn(name, password);
            } catch (e) {
                setError(e.message);
            } finally {
                setStatus(false);
            }
        };

        setStatus(true);
        setTimeout(login, 1000 + randomRange(250));
    };

    return (
        <CenteredPane>
            <form
                onSubmit={ onFormSubmit }
            >
                <div
                    className={ styles.logo }
                >
                    <img
                        alt="Baking Mama"
                        src="/assets/mama.png"
                    />
                </div>
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
                        disabled={ status }
                    >
                        { status
                            ? (
                                <Spinner
                                    className={ styles.spinner }
                                />
                            )
                            : "Sign in" }
                    </ButtonBase>
                    <div
                        className={ styles.actions }
                    >
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

export default SignIn;
