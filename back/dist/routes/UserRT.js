import express from "express";
import { USER } from "../controllers/UserCON.js";
import { VAL } from "../middleware/Val.js";
import { PRO } from "../middleware/Auth.js";
import { RSchema, LSchema } from "../validation/Schema.js";
// Routes:  localhost:9000/api/users
export const userRt = express.Router();
userRt.post("/users/register", VAL(RSchema), USER.Register);
userRt.post("/users/login", VAL(LSchema), USER.Login);
userRt.get("/users", USER.FetchAll);
userRt.post("/users/logout", USER.Logout);
userRt.get("/users/me", PRO, USER.Me);
userRt.get("/users/:id", USER.GetOne);
userRt.put("/users/:id", VAL(RSchema), USER.Update);
userRt.delete("/users/:id", USER.Delete);
