import * as tokenService from "../services/token.service.js";

// The controllers handle extracting infromation from the requests and emitting responses.
const tokenController = {
    async generateTokens(req, res, next) {
        try {
            const result = await tokenService.generateTokens(req.body.tokens);
            res.json({
                message: `Generated ${req.body.tokens} tokens`,
                created: result.created,
                token: result.token
            });
        } catch (error) {
            next(error);
        }
    },
    async checkToken(req, res, next) {
        try {
            const status = await tokenService.checkTokenStatus(req.params.token);
            res.json({
                status: status
            });
        } catch (error) {
            next(error);
        }
    },
    async redeemToken(req, res, next) {
        try {
            let statusCode = 400, result = "invalid";
            const redeemStatus = await tokenService.redeemToken(req.params.token);
            if (redeemStatus == "ok") {
                statusCode = 200;
                result = "ok";
            }
            else {
                statusCode = 410;
                result = redeemStatus
            }
            res.status(statusCode).json({
                result: result
            });
        } catch (error) {
            next(error);
        }
    }
};

export default tokenController;