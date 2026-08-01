import React from "react";
import classes from "./Login.module.css";
import { LoginForm } from "../../components/form/LoginForm";

export const Login = () => {
    return (
        <React.Fragment>
            <main>
                <h1 className={classes.title}>Login Page</h1>
                <LoginForm />
            </main>
        </React.Fragment>
    );
};


