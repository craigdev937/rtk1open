class ErrorInfo {
    notFound = (req, res, next) => {
        const error = new Error(`
            Not Found = ${req.originalUrl}
        `);
        res.status(404);
        next(error);
    };
    errHandler = (error, req, res) => {
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
}
;
export const ERR = new ErrorInfo();
