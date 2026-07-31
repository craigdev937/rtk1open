import React from "react";
import "./App.css";
import { NavRoutes } from "../routes/NavRoutes";
// import { useTheme } from "../global/useTheme";

export const App = () => {
    // useTheme();

    return (
        <React.Fragment>
            <NavRoutes />
        </React.Fragment>
    );
};


