import "dotenv/config";
import express from "express";
import helmet from "helmet";
import logger from "morgan";
import multer from "multer";
import cookieParser from "cookie-parser";
import { ERR } from "./middleware/midError.ts";
import { userRt } from "./routes/UserRT.ts";
import { taleRt } from "./routes/TaleRT.ts";

export const App: express.Application = express();
App.use(helmet());

// CORS Setup.
App.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods",
            "POST, GET, PUT, PATCH, DELETE");
        return res
            .status(res.statusCode)
            .json({ "status message": "OK" });
    };
    next();
});

App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(cookieParser());
App.use(logger("dev"));
App.use("/api", userRt);
App.use("/api", taleRt);
App.use(ERR.notFound);
App.use(ERR.errHandler);



