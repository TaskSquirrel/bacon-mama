import React from "react";
import { Link } from "react-router-dom";

import CenteredPane from "../CenteredPane";
import TextField from "../controls/TextField";
import ButtonBase from "../controls/ButtonBase";

import styles from "./SignIn.module.scss";

const SignIn: React.FC = () => {
    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // Stop page from refreshing
        event.preventDefault();
    };

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
                    />
                    <TextField
                        required
                        type="password"
                        placeholder="Password"
                    />
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
