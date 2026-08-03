import React from "react";
import styles from "./RegisterForm.module.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RSchema } from "../../validation/Schema";
import type { RType } from "../../validation/Schema";
import { UAPI } from "../../global/UAPI";
import { UAD } from "../../global/Hooks";
import { setUser } from "../../global/UserSlice";

export const RegisterForm = () => {
    const dispatch = UAD();
    const [reguser, { isLoading }] = UAPI.useRegMutation();
    const [status, setStatus] = React.useState<string | null>(null);
    const { register, handleSubmit, reset,
        formState: { errors } } = useForm<RType>({
        resolver: zodResolver(RSchema)
    });

    const onSubmit = async (data: RType) => {
        setStatus(null);
        try {
            const res = await reguser(data).unwrap();
            const { id, email } = res.data.user;
            dispatch(setUser({ id, email }));
            setStatus(res.message);
            reset();
        } catch {
            setStatus("We could not register you. Please try again.");
        }
    };

    return (
        <section className={styles.form__wrap}>
            <form
                noValidate
                className={styles.form}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={styles.form__field}>
                    <label htmlFor="first">First Name</label>
                    <input
                        id="first"
                        placeholder="First Name"
                        autoComplete="given-name"
                        aria-invalid={!!errors.first}
                        {...register("first")}
                    />
                    {errors.first && <p className={styles.form__error}>
                        {errors.first?.message}</p>}
                </div>

                <div className={styles.form__field}>
                    <label htmlFor="last">Last Name</label>
                    <input
                        id="last"
                        placeholder="Last Name"
                        autoComplete="family-name"
                        aria-invalid={!!errors.last}
                        {...register("last")}
                    />
                    {errors.last && <p className={styles.form__error}>
                        {errors.last?.message}</p>}
                </div>

                <div className={`${styles.form__field} ${styles.form__span}`}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                    />
                    {errors.email && <p className={styles.form__error}>
                        {errors.email?.message}</p>}
                </div>

                <div className={`${styles.form__field} ${styles.form__span}`}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        aria-invalid={!!errors.password}
                        {...register("password")}
                    />
                    {errors.password && <p className={styles.form__error}>
                        {errors.password?.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={styles.form__button}
                >
                    {isLoading ? "Registering..." : "Register User"}
                </button>

                {status && <p
                    role="status"
                    className={styles.form__status}
                >{status}</p>}
            </form>
        </section>
    );
};


