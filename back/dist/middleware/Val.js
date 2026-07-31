import { ZodError } from "zod";
export const VAL = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            return next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: "Fail!",
                    errors: error.issues.map((err) => ({
                        path: err.path,
                        message: err.message
                    })),
                });
            }
            ;
            return res.status(500).json({
                status: "Error!",
                message: "Internal Server Error"
            });
        }
    };
};
