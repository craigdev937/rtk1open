import express from "express";
import fs from "fs";
import multer from "multer";

// Multer Configuration.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync("uploads")) {
            fs.mkdirSync("uploads", { recursive: true });
        };
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${
            Date.now()}-${Math.round(Math.random() * 1e9)
        }`;
        const ext = file.originalname.split(".").pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
    },
});

const fileFilter = (
    req: express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const ALLOWED_MIME_TYPES = [
        "image/svg", "image/jpg",
        "image/jpeg", "image/png",
        "image/gif", "image/webp",
        "image/avif", "application/pdf"
    ];
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
};

export const UP = multer({
    storage, fileFilter, limits: {
        fileSize: 5 * 1024 * 1024,  //  5MB.
    }
});



