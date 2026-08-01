import React from "react";
import styles from "./Register.module.css";
import { RegisterForm } from "../../components/form/RegisterForm";

export const Register = () => {
    return (
        <React.Fragment>
            <main>
                <h1 className={styles.title}>Register Page</h1>
                <RegisterForm />
            </main>
        </React.Fragment>
    );
};


