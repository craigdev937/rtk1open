import React from "react";
import "./App.css";
import CBStrike from "@public/CBStrike16.jpg";

export const App = () => {
    return (
        <React.Fragment>
            <h1>CBStrike</h1>
            <img 
                alt="CBStrike" src={CBStrike}
                height={"600px"} width={"auto"}
            />
        </React.Fragment>
    );
};


