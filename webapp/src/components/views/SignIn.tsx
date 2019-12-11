import React, { useState } from "react";
import { Link } from "react-router-dom";

import useUser from "../hooks/useUser";

import CenteredPane from "../CenteredPane";
import TextField from "../controls/TextField";
import ButtonBase from "../controls/ButtonBase";

import useLoadingIndicator from "../hooks/useLoadingIndicator";

import styles from "./SignIn.module.scss";

const SignIn: React.FC = () => {
    const { setStatus } = useLoadingIndicator();
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
                setStatus(true);
                await signIn(name, password);
            } catch (e) {
                setError(e.message);
            } finally {
                setStatus(false);
            }
        };

        login();
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

export default SignIn;
