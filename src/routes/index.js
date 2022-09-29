import {Router} from "express";
import tokenRouter from "./token.router.js";

const globalRouter = Router();
globalRouter.use("/token", tokenRouter);

export default globalRouter;