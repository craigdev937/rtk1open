import jwt from "jsonwebtoken";
import { dBase } from "../data/Database.js";
const JWT = process.env.JWT_SECRET ?? "";
export const PRO = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ msg: "Not Authorized, No Token!" });
    }
    ;
    try {
        const decoded = jwt.verify(token, JWT);
        const QRY = "SELECT * FROM users WHERE id=$1";
        const user = await dBase.query(QRY, [decoded.id]);
        req.user = user.rows[0];
        next();
    }
    catch (error) {
        res
            .status(500)
            .json({
            success: false,
            message: "Invalid Token!",
            error: error instanceof Error ?
                error.message : "Unknown Error!"
        });
        next(error);
    }
    ;
};
export const signToken = (id) => {
    return jwt.sign({ id }, JWT, { expiresIn: "30d" });
};
