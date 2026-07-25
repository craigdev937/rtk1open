import express from "express";
import { TALE } from "../controllers/TaleCON.ts";
import { PRO } from "../middleware/Auth.ts";
import { VAL } from "../middleware/Val.ts";
import { TSchema } from "../validation/Schema.ts";
import { UP } from "../middleware/Multer.ts";

// ROUTES   http://localhost:9000/api/tale
export const taleRt: express.Router = express.Router();
    taleRt.post("/tale", PRO, 
        UP.single("poster"), 
        VAL(TSchema), TALE.Create);
    taleRt.get("/tale", TALE.FetchAll);
    taleRt.get("/tale/:id", TALE.GetOne);
    taleRt.put("/tale/:id", PRO,
        UP.single("poster"),
        VAL(TSchema), TALE.Update);
    taleRt.delete("/tale/:id", PRO, TALE.Delete);


