import React from "react";
import styles from "./Navbar.module.css";
import { Link, Outlet } from "react-router";
import { Sun, Moon } from "lucide-react";
import { UAS, UAD } from "../global/Hooks";
import { toggleTheme } from "../global/ThemeSlice";

export const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const dispatch = UAD();
    const mode = UAS((state) => state.theme.mode);

    const handleClick = () => {
        setOpen(!open)
    };

    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <header className={styles.nav__header}>
                <nav className={styles.nav}>
                    <Link
                        to={"/"}
                        className={styles.nav__logo}
                    >
                        <svg className={styles.nav__img} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#5084C1"><path d="m499-259 364-363-81-80-363 363 80 80Zm-280 48q-88-6-133.5-40.5T40-349q0-60 51-98t142-46q44-4 65.5-16t21.5-33q0-29-29-44.5T194-609l5-60q89 9 135 41t46 86q0 46-37.5 75T238-433q-69 5-103.5 26T100-349q0 35 30.5 54.5T222-271l-3 60Zm299 18L353-358l398-397q14-14 31.5-13.5T814-755l102 101q14 14 14 32t-14 32L518-193Zm-159 33q-17 4-30-9t-9-30l33-159 165 165-159 33Z"/></svg>
                    </Link>

                    {/* THEME TOGGLE */}
                    <button 
                        className={styles.nav__theme}
                        type="button"
                        aria-label={mode === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                        }
                        title={mode === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                        }
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {mode === "dark" ? (
                            <Sun className={styles.nav__icon} />
                        ) : (
                            <Moon className={styles.nav__icon} />
                        )}
                    </button>

                    {/* NAV MENU BUTTON */}
                    <button
                        className={styles.nav__button}
                        type="button"
                        aria-label="toggle"
                        aria-expanded={open}
                        onClick={handleClick}
                    >
                        <aside className={`
                            ${styles.nav__burger}
                            ${open ? styles.open : ""}
                        `}>
                            <span className={styles.nav__line} />
                            <span className={styles.nav__line} />
                            <span className={styles.nav__line} />
                        </aside>
                    </button>

                    {/* SIDEBAR AND MEDIA QUERIES */}
                    <menu className={open ?
                        `${styles.nav__menu} ${styles.active}` 
                        : `${styles.nav__menu}`
                    }>
                        <li className={styles.nav__item}>
                            <Link
                                to={"/"}
                                className={styles.nav__links}
                                onClick={closeMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li className={styles.nav__item}>
                            <Link
                                to={"/register"}
                                className={styles.nav__links}
                                onClick={closeMenu}
                            >
                                Register
                            </Link>
                        </li>
                        <li className={styles.nav__item}>
                            <Link
                                to={"/login"}
                                className={styles.nav__links}
                                onClick={closeMenu}
                            >
                                Login
                            </Link>
                        </li>
                    </menu>
                </nav>
            </header>
            <Outlet />
        </React.Fragment>
    );
};


