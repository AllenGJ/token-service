import Token from "../models/token.model.js";

// The service layer handles business logic and returns finished results.

/**
 * Generates tokens.
 * @param {number} tokenCount 
 * @returns {object}
 */
const generateTokens = async (tokenCount) => {
    const dateNow = Date.now();
    let tokens = [];
    
    for (let i = 0; i < tokenCount; i++) {
        const token = await Token.addOne({status: "available", created: dateNow});
        tokens.push(token.id);
    }
    
    return {
        created: dateNow,
        token: tokens
    };
};

/**
 * Checks the status of an individual token.
 * @param {string} tokenId Token identifier
 * @returns {string} Status of the token
 */
const checkTokenStatus = async (tokenId) => {
    const token = await Token.getOne(tokenId);
    if (!token) {
        return "invalid";
    }

    await token.expireIfNeeded();    
    return token.status;
};

/**
 * Redeems token and reports result.
 * @param {string} tokenId Token identifier
 * @returns {string} Result of the operation
 */
const redeemToken = async (tokenId) => {
    const status = await Token.redeem(tokenId);
    return status;
};

export {
    generateTokens,
    checkTokenStatus,
    redeemToken
};