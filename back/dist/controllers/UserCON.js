import bcrypt from "bcryptjs";
import { dBase } from "../data/Database.js";
import { signToken } from "../middleware/Auth.js";
import { RSchema, LSchema } from "../validation/Schema.js";
class UserClass {
    Register = async (req, res, next) => {
        try {
            const R = RSchema.parse(req.body);
            const eQRY = "SELECT email FROM users WHERE email=$1";
            const userExists = await dBase.query(eQRY, [R.email]);
            if (userExists.rows.length > 0) {
                return res.status(401)
                    .json({ msg: "That User already Exists!" });
            }
            ;
            const bPASS = await bcrypt.hash(R.password, 10);
            const QRY = `INSERT INTO users 
            (first, last, email, password) 
            VALUES ($1, $2, $3, $4) RETURNING *`;
            const values = [R.first, R.last, R.email, bPASS];
            const newUser = await dBase.query(QRY, values);
            const newToken = signToken(newUser.rows[0].id);
            res.cookie("token", newToken, {
                httpOnly: true,
                secure: false, // Set to true for Production.
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 30 // 30-Days.
            });
            return res
                .status(201)
                .json({
                success: true,
                message: "User has Registered!",
                data: {
                    user: newUser.rows[0],
                    token: newToken
                }
            });
        }
        catch (error) {
            res
                .status(res.statusCode)
                .json({
                success: false,
                message: "Error Registering the User!",
                error: error instanceof Error ?
                    error.message : "Unknown Error!"
            });
            next(error);
        }
    };
    FetchAll = async (req, res, next) => {
        try {
            const QRY = "SELECT * FROM users ORDER BY id ASC";
            const users = await dBase.query(QRY);
            return res
                .status(201)
                .json({
                success: true,
                message: "All Registered Users!",
                count: users.rows.length,
                data: users.rows
            });
        }
        catch (error) {
            res
                .status(res.statusCode)
                .json({
                success: false,
                message: "Error fetching all the Users!",
                error: error instanceof Error ?
                    error.message : "Unknown Error!"
            });
            next(error);
        }
    };
    Login = async (req, res, next) => {
        try {
            const L = LSchema.parse(req.body);
            const QRY = "SELECT * FROM users WHERE email=$1";
            const user = await dBase.query(QRY, [L.email]);
            if (user.rows.length === 0) {
                return res
                    .status(401)
                    .json({ msg: "Invalid Credentials!" });
            }
            ;
            const uData = user.rows[0];
            const isMatch = await bcrypt.compare(L.password, uData.password);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ msg: "Invalid Credentials!" });
            }
            ;
            const logToken = signToken(uData.id);
            res.cookie("token", logToken, {
                httpOnly: true,
                secure: false, // Change to true for Production!
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 30 // 30-Days.
            });
            return res
                .status(201)
                .json({
                success: true,
                message: "The User has Logged In!",
                data: {
                    id: uData.id,
                    email: uData.email
                },
                token: logToken
            });
        }
        catch (error) {
            res
                .status(res.statusCode)
                .json({
                success: false,
                message: "Error logging in the User!",
                error: error instanceof Error ?
                    error.message : "Unknown Error!"
            });
            next(error);
        }
    };
    Logout = async (req, res, next) => {
        try {
            res.cookie("token", "", {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 1
            });
            res
                .status(201)
                .json({
                success: true,
                message: "The User has Logged Out!"
            });
        }
        catch (error) {
            res
                .status(res.statusCode)
                .json({
                success: false,
                message: "Error logging out the User!",
                error: error instanceof Error ?
                    error.message : "Unknown Error!"
            });
            next(error);
        }
    };
    Me = async (req, res, next) => {
        try {
            res.json({
                success: true,
                message: "User Info",
                data: req.user
            });
        }
        catch (error) {
            res
                .status(res.statusCode)
                .json({
                success: false,
                message: "Error finding User Info!",
                error: error instanceof Error ?
                    error.message : "Unknown Error!"
            });
            next(error);
        }
    };
    GetOne = async (req, res, next) => {
        try {
            const { id } = req.params;
            const QRY = "SELECT * FROM users WHERE id=$1";
            const oneUser = await dBase.query(QRY, [id]);
            return res
                .status(201)
                .json({
                success: true,
                message: "User",
                data: oneUser.rows[0]
            });
        }
        catch (error) {
            res
                .status(res.statusCode)
                .json({
                success: false,
                message: "Error finding One User!",
                error: error instanceof Error ?
                    error.message : "Unknown Error!"
            });
            next(error);
        }
    };
    Update = async (req, res, next) => {
        try {
            const U = RSchema.parse(req.body);
            const { id } = req.params;
            const QRY = `UPDATE users 
            SET first=$1, last=$2, email=$3, password=$4,
            updated_at=CURRENT_TIMESTAMP 
            WHERE id=$5 RETURNING *`;
            const values = [U.first, U.last, U.email, U.password, id];
            const updatedUser = await dBase.query(QRY, values);
            return res
                .status(201)
                .json({
                success: true,
                message: "The User was Updated!",
                data: updatedUser.rows[0]
            });
        }
        catch (error) {
            res
                .status(res.statusCode)
                .json({
                success: false,
                message: "Error Updating the User!",
                error: error instanceof Error ?
                    error.message : "Unknown Error!"
            });
            next(error);
        }
    };
    Delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const QRY = "DELETE FROM users WHERE id=$1";
            const values = [id];
            const delUser = await dBase.query(QRY, values);
            return res
                .status(201)
                .json({
                success: true,
                message: "The User was Deleted!",
                data: delUser.rows[0]
            });
        }
        catch (error) {
            res
                .status(res.statusCode)
                .json({
                success: false,
                message: "Error Deleting the User!",
                error: error instanceof Error ?
                    error.message : "Unknown Error!"
            });
            next(error);
        }
    };
}
;
export const USER = new UserClass();
