import { describe, it, expect, beforeEach, afterEach } from "@rstest/core";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { toggleTheme, setTheme, ThemeReducer } from "../global/ThemeSlice";
import type { TTheme } from "../models/Interfaces";
import { Navbar } from "../routes/Navbar";

/* ThemeSlice applies the theme as a side effect, so every test starts
from a known localStorage / <html> state and tears down its render. */
beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
});

afterEach(() => {
    cleanup();
});

describe("ThemeSlice", () => {
    it("flips light to dark", () => {
        const state = ThemeReducer({ mode: "light" }, toggleTheme());
        expect(state.mode).toBe("dark");
    });

    it("flips dark to light", () => {
        const state = ThemeReducer({ mode: "dark" }, toggleTheme());
        expect(state.mode).toBe("light");
    });

    it("sets an explicit mode", () => {
        const state = ThemeReducer({ mode: "dark" }, setTheme("dark"));
        expect(state.mode).toBe("dark");
    });

    it("persists the toggled mode to localStorage", () => {
        ThemeReducer({ mode: "light" }, toggleTheme());
        expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("persists an explicit mode to localStorage", () => {
        ThemeReducer({ mode: "dark" }, setTheme("light"));
        expect(localStorage.getItem("theme")).toBe("light");
    });

    it("reflects the mode on <html> for the App.css variables", () => {
        ThemeReducer({ mode: "light" }, setTheme("dark"));
        expect(document.documentElement.getAttribute("data-theme"))
            .toBe("dark");
    });
});

describe("Navbar theme toggle", () => {
    /* A fresh store per test — the exported RED singleton would leak
    the mode from one test into the next. */
    const renderNav = (mode: TTheme) => {
        const store = configureStore({
            reducer: { theme: ThemeReducer },
            preloadedState: { theme: { mode } }
        });
        const router = createMemoryRouter(
            [{ path: "/", element: <Navbar /> }],
            { initialEntries: ["/"] }
        );
        render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        );
        return store;
    };

    it("labels the button for the opposite of the current mode", () => {
        renderNav("dark");
        const button = screen.getByRole("button", { name: /switch to/i });
        expect(button.getAttribute("aria-label"))
            .toBe("Switch to light mode");
        expect(button.getAttribute("title"))
            .toBe("Switch to light mode");
    });

    it("dark to light: updates the store, <html> and the label", () => {
        const store = renderNav("dark");

        fireEvent.click(screen.getByRole("button", {
            name: "Switch to light mode"
        }));

        expect(store.getState().theme.mode).toBe("light");
        expect(document.documentElement.getAttribute("data-theme"))
            .toBe("light");
        expect(screen.getByRole("button", {
            name: "Switch to dark mode"
        })).toBeTruthy();
    });

    it("light to dark: updates the store, <html> and the label", () => {
        const store = renderNav("light");

        fireEvent.click(screen.getByRole("button", {
            name: "Switch to dark mode"
        }));

        expect(store.getState().theme.mode).toBe("dark");
        expect(document.documentElement.getAttribute("data-theme"))
            .toBe("dark");
        expect(screen.getByRole("button", {
            name: "Switch to light mode"
        })).toBeTruthy();
    });

    it("leaves the hamburger menu closed while toggling", () => {
        renderNav("dark");
        const burger = screen.getByRole("button", { name: "toggle" });

        fireEvent.click(screen.getByRole("button", { name: /switch to/i }));

        expect(burger.getAttribute("aria-expanded")).toBe("false");
    });
});
