import express from "express";
import { TALE } from "../controllers/TaleCON.js";
import { PRO } from "../middleware/Auth.js";
import { VAL } from "../middleware/Val.js";
import { TSchema } from "../validation/Schema.js";
import { UP } from "../middleware/Multer.js";
// ROUTES   http://localhost:9000/api/tale
export const taleRt = express.Router();
taleRt.post("/tale", PRO, UP.single("poster"), VAL(TSchema), TALE.Create);
taleRt.get("/tale", TALE.FetchAll);
taleRt.get("/tale/:id", TALE.GetOne);
taleRt.put("/tale/:id", PRO, UP.single("poster"), VAL(TSchema), TALE.Update);
taleRt.delete("/tale/:id", PRO, TALE.Delete);
