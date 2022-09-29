import {Router} from "express";
import tokenRouter from "./token.router.js";

const globalRouter = Router();

// Add all subroutes below.
globalRouter.use("/token", tokenRouter);

export default globalRouter;