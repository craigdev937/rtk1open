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

// CORS Setup.  Credentialed requests cannot use "*", so the
// request Origin is echoed back only when it is on the allow list.
const ORIGINS = (process.env.CLIENT_URL ?? "http://localhost:6173")
    .split(",")
    .map((origin) => origin.trim());

App.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ORIGINS.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", "true");
    };
    // The response varies by Origin, so caches must not share it.
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods",
            "POST, GET, PUT, PATCH, DELETE");
        res.header("Access-Control-Max-Age", "86400");
        return res.sendStatus(204);
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



