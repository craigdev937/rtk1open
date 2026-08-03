import React from "react";
import styles from "./home.module.css";
import IMG from "@public/home.png";
import { Link } from "react-router";
import { TAPI, HOST } from "../../global/TAPI";
import { Spinner } from "../../components/spin/Spinner";

export const Home = () => {
    const { error, isLoading,
        data } = TAPI.useTalesQuery();
    const TA = data?.data;

    if (error) {
        if ("status" in error) {
            const errMSG = "error" in error ?
                error.error :
                JSON.stringify(error.data);
            return <h1>Error: {errMSG}</h1>;
        } else {
            return <h1>Error: {error.message}</h1>
        }
    };

    return (
    <React.Fragment>
        {isLoading ? (
            <Spinner />
        ) : (
            <main className={styles.home}>
                <h1 className={styles.title}>
                    Create a Tale and Share with Everyone!
                </h1>

                <section className={styles.hero}>
                    <Link to="/write"
                        className={styles.hero__button}>
                        Create a Tale
                    </Link>
                </section>

                <section>
                    <h2 className={styles.section__title}>
                        Latest Tales
                    </h2>
                    {TA && TA.length > 0 ? (
                        <ul className={styles.grid}>
                            {TA.map((tale) => (
                                <li key={tale.id}>
                                    <Link to={`/tale/${tale.id}`}
                                        className={styles.card}>
                                        <img
                                            className={styles.card__poster}
                                            src={tale.poster 
                                                ? `${HOST}${tale.poster}` :
                                                IMG}
                                            alt={tale.title}
                                            loading="lazy"
                                        />
                                        <div className={styles.card__body}>
                                            <h3 className={styles.card__title}>
                                                {tale.title}
                                            </h3>
                                            <p className={styles.card__text}>
                                                {tale.text}
                                            </p>
                                            <div className={styles.card__meta}>
                                                <span>
                                                    {new Date(tale.created_at)
                                                        .toLocaleDateString()}
                                                </span>
                                                <span>
                                                    {tale.views} views
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.empty}>
                            No Tales yet. Be the first to write one!
                        </p>
                    )}
                </section>
            </main>
        )}
    </React.Fragment>
    );
};


