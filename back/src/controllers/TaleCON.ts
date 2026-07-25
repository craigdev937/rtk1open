import express from "express";
import { dBase } from "../data/Database.ts";
import { TSchema } from "../validation/Schema.ts";
import type { ITale } from "../models/Interfaces.ts";
import type { TType } from "../validation/Schema.ts";

class TalesClass {
    Create: express.Handler = async (req, res, next) => {
        try {
            const T = TSchema.parse(req.body);
            const poster = req.file ? 
                `/api/tale/posters/${req.file.filename}` : null;
            const QRY = `INSERT INTO tales
            (author_id, title, text, poster)
            VALUES ($1, $2, $3, $4) RETURNING *`;
            const values = [T.author_id, T.title, T.text, poster];
            const newTale = await dBase.query<TType>(QRY, values);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The Tale was Created!",
                    data: newTale.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error Creating the Tale!",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            next(error);
        }
    };

    FetchAll: express.Handler = async (req, res, next) => {
        try {
            const QRY = "SELECT * FROM tales ORDER BY id ASC";
            const tales = await dBase.query<ITale[]>(QRY);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "All Tales!",
                    count: tales.rows.length,
                    data: tales.rows
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error fetching all the Tales!",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            next(error);
        }
    };

    GetOne: express.Handler = async (req, res, next) => {
        try {
            const { id } = req.params;
            const QRY = `UPDATE tales SET views = views + 1
            WHERE id=$1 RETURNING *`;
            const value = [id];
            const oneTale = await dBase.query<ITale>(QRY, value);
            if (oneTale.rows.length <= 0) {
                return res.status(400)
                    .json({ msg: "That Tale doesn't exist!" });
            };
            return res
                .status(201)
                .json({
                    success: true,
                    message: "One Tale!",
                    data: oneTale.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error uploading a Image!",
                    error: error instanceof Error ?
                        error.message: "Unknown Error!"
                });
            next(error);
        }
    };

    Update: express.Handler = async (req, res, next) => {
        try {
            const T = TSchema.parse(req.body);
            const { id } = req.params;
            const poster = req.file ? 
                `/api/tale/posters/${req.file.filename}` : null;
            const QRY = `UPDATE tales 
            SET author_id=$1, title=$2, text=$3, poster=$4, 
            updated_at=CURRENT_TIMESTAMP 
            WHERE id=$5 RETURNING *`;
            const values = [T.author_id, T.title, T.text, poster, id];
            const updatedTale = await dBase.query<ITale>(QRY, values);
            if (updatedTale.rows.length <= 0) {
                return res.status(400)
                    .json({ msg: "That Tale doesn't exist!" });
            };
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The Tale was Updated!",
                    data: updatedTale.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error updating the Tale!",
                    error: error instanceof Error ?
                        error.message: "Unknown Error!"
                });
            next(error);
        }
    };

    Delete: express.Handler = async (req, res, next) => {
        try {
            const { id } = req.params;
            const QRY = "DELETE FROM tales WHERE id=$1";
            const values = [id];
            const delTale = await dBase.query<ITale>(QRY, values);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The Tale was Deleted!",
                    data: delTale.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error updating the Tale!",
                    error: error instanceof Error ?
                        error.message: "Unknown Error!"
                });
            next(error);
        }
    };
};

export const TALE: TalesClass = new TalesClass();


