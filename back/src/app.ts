import "dotenv/config";
import express from "express";
import helmet from "helmet";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { ERR } from "./middleware/midError.ts";
import { userRt } from "./routes/UserRT.ts";
import { taleRt } from "./routes/TaleRT.ts";

export const App: express.Application = express();
// The posters are read from a different origin than the API, and
// helmet's default "same-origin" policy would block the <img>.
App.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Setup.
const ORIGINS = (process.env.CLIENT_URL ??
    "http://localhost:6173").split(",").map(o => o.trim());

App.use((req, res, next) => {
    const origin = req.headers.origin;
    // Credentialed requests reject the "*" wildcard, so the
    // exact origin has to be echoed back instead.
    if (origin && ORIGINS.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", "true");
    };
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods",
            "POST, GET, PUT, PATCH, DELETE");
        return res.sendStatus(204);
    };
    next();
});

App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(cookieParser());
App.use(logger("dev"));
// Multer drops the uploads in "uploads", but the rows store them
// as "/api/tale/posters/x.jpg", so that path has to be served.
App.use("/api/tale/posters", express.static("uploads"));
App.use("/api", userRt);
App.use("/api", taleRt);
App.use(ERR.notFound);
App.use(ERR.errHandler);



