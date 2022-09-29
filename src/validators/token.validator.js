import {body, param} from "express-validator"

// Defines validations to be performed on the token routes.

const tokenCountValidator = [body("tokens").isInt({min:0, max:100}).withMessage("should be an integer in the range 0 - 100"),];                   // Add more validation conditions to the array as required
const tokenCheckValidator = param("token").notEmpty().isAlphanumeric().withMessage("should be an alphanumeric string");
const tokenRedeemValidator = body("token").notEmpty().isAlphanumeric().withMessage("should be an alphanumeric string");

export {tokenCountValidator, tokenCheckValidator, tokenRedeemValidator};