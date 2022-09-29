import { Router } from "express";
import { tokenCountValidator, tokenCheckValidator, tokenRedeemValidator } from "../validators/token.validator.js";
import processValidation from "../utils/validation.util.js";
import tokenController from "../controllers/token.controller.js";

const tokenRouter = Router();

// The router defines middleware and route handlers for each route.
tokenRouter.post(
    "/generate",
    tokenCountValidator,
    processValidation,
    tokenController.generateTokens
);

tokenRouter.get(
    "/check/:token",
    tokenCheckValidator,
    processValidation,
    tokenController.checkToken
);

tokenRouter.put(
    "/redeem/:token",
    tokenRedeemValidator,
    processValidation,
    tokenController.redeemToken
);

export default tokenRouter;