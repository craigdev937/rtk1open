import express from "express";
import bcrypt from "bcryptjs";
import { dBase } from "../data/Database.ts";
import { signToken } from "../middleware/Auth.ts";
import { RSchema, LSchema } from "../validation/Schema.ts";
import type { RType } from "../validation/Schema.ts";
import type { IReg, ILog } from "../models/Interfaces.ts";
import { email } from "zod";

class UserClass {
    Register: express.Handler = async (req, res, next) => {
        try {
            const R = RSchema.parse(req.body);
            const eQRY = "SELECT email FROM users WHERE email=$1";
            const userExists = await dBase.query<RType>(eQRY, [R.email]);
            if (userExists.rows.length > 0) {
                return res.status(401)
                .json({ msg: "That User already Exists!" });
            };
            const bPASS = await bcrypt.hash(R.password, 10);
            const QRY = `INSERT INTO users 
            (first, last, email, password) 
            VALUES ($1, $2, $3, $4) RETURNING *`;
            const values = [R.first, R.last, R.email, bPASS];
            const newUser = await dBase.query<IReg>(QRY, values);
            const newToken = signToken(newUser.rows[0].id);
            res.cookie("token", newToken, {
                httpOnly: true,
                secure: false,  // Set to true for Production.
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 30  // 30-Days.
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
        } catch (error) {
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

    FetchAll: express.Handler = async (req, res, next) => {
        try {
            const QRY = "SELECT * FROM users ORDER BY id ASC";
            const users = await dBase.query<IReg[]>(QRY);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "All Registered Users!",
                    count: users.rows.length,
                    data: users.rows
                });
        } catch (error) {
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

    Login: express.Handler = async (req, res, next) => {
        try {
            const L = LSchema.parse(req.body);
            const QRY = "SELECT * FROM users WHERE email=$1";
            const user = await dBase.query<ILog>(QRY, [L.email]);
            if (user.rows.length === 0) {
                return res
                    .status(401)
                    .json({ msg: "Invalid Credentials!" });
            };

            const uData = user.rows[0];
            const isMatch = await bcrypt.compare(
                L.password, 
                uData.password
            );
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ msg: "Invalid Credentials!" });
            };

            const logToken = signToken(uData.id);
            res.cookie("token", logToken, {
                httpOnly: true,
                secure: false,  // Change to true for Production!
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 30  // 30-Days.
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
        } catch (error) {
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

    Logout: express.Handler = async (req, res, next) => {
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
        } catch (error) {
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

    Me: express.Handler = async (req, res, next) => {
        try {
            res.json({
                success: true,
                message: "User Info",
                data: req.user
            });
        } catch (error) {
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

    GetOne: express.Handler = async (req, res, next) => {
        try {
            const { id } = req.params;
            const QRY = "SELECT * FROM users WHERE id=$1";
            const oneUser = await dBase.query<IReg>(QRY, [id]);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "User",
                    data: oneUser.rows[0]
                });
        } catch (error) {
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

    Update: express.Handler = async (req, res, next) => {
        try {
            const U = RSchema.parse(req.body);
            const { id } = req.params;
            const QRY = `UPDATE users 
            SET first=$1, last=$2, email=$3, password=$4,
            updated_at=CURRENT_TIMESTAMP 
            WHERE id=$5 RETURNING *`;
            const values = [U.first, U.last, U.email, U.password, id];
            const updatedUser = await dBase.query<IReg>(QRY, values);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The User was Updated!",
                    data: updatedUser.rows[0]
                });
        } catch (error) {
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

    Delete: express.Handler = async (req, res, next) => {
        try {
            const { id } = req.params;
            const QRY = "DELETE FROM users WHERE id=$1";
            const values = [id];
            const delUser = await dBase.query<IReg>(QRY, values);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The User was Deleted!",
                    data: delUser.rows[0]
                });
        } catch (error) {
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
};

export const USER: UserClass = new UserClass();



