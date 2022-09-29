import { validationResult } from "express-validator";

function errorFormatter({ location, msg, param, value, nestedErrors }) {
    return `Validation error for field ${param} at ${location}: ${msg} (received ${value})`;
}

function processValidation (req, res, next) {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        let errorString = errors.array().join("|");
        
        return next({
            status: 400,
            message: errorString
        });
    }
    next();
};

export default processValidation;