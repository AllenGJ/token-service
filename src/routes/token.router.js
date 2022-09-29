import { Router } from "express";
import { tokenCountValidator } from "../validators/token.validator.js";
import processValidation from "../utils/validation.util.js";
import tokenController from "../controllers/token.controller.js";

const tokenRouter = Router();

tokenRouter.post(
    "/generate",
    tokenCountValidator,
    processValidation,
    tokenController.generateTokens
);

tokenRouter.get(
    "/check/:token",
    processValidation,
    tokenController.checkToken
);

tokenRouter.put(
    "/redeem/:token",
    processValidation,
    tokenController.redeemToken
);

export default tokenRouter;