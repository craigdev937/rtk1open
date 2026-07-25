import express from "express";

class ErrorInfo {
    notFound: express.Handler = (req, res, next) => {
        const error: Error = new Error(`
            Not Found = ${req.originalUrl}
        `);
        res.status(404);
        next(error);
    };

    errHandler: express.ErrorRequestHandler =
    (error, req, res) => {
        const statusCode = res.statusCode === 200 ?
            500 : res.statusCode;
        res
            .status(statusCode)
            .json({
                message: error.message,
                stack: process.env.NODE_ENV === "production" ?
                    undefined : error.stack
            });
    };
};

export const ERR: ErrorInfo = new ErrorInfo();


