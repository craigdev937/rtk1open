import React from "react";
import styles from "./LoginForm.module.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LSchema } from "../../validation/Schema";
import type { LType } from "../../validation/Schema";
import { UAPI } from "../../global/UAPI";
import { UAD } from "../../global/Hooks";
import { setUser } from "../../global/UserSlice";

export const LoginForm = () => {
    const dispatch = UAD();
    const [loguser, { isLoading }] = UAPI.useLogMutation();
    const [status, setStatus] = React.useState<string | null>(null);
    const { register, handleSubmit, reset,
        formState: { errors } } = useForm<LType>({
        resolver: zodResolver(LSchema)
    });

    const onSubmit = async (data: LType) => {
        setStatus(null);
        try {
            const res = await loguser(data).unwrap();
            dispatch(setUser(res.data));
            setStatus(res.message);
            reset();
        } catch {
            setStatus("Invalid credentials. Please try again.");
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

                <div className={styles.form__field}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
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
                    {isLoading ? "Logging In..." : "Login User"}
                </button>

                {status && <p
                    role="status"
                    className={styles.form__status}
                >{status}</p>}
            </form>
        </section>
    );
};


