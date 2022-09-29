import Token from "../models/token.model.js";
const tokenTtl = 10000;
// const tokenTtl = 10 * 24 * 60 * 60 * 1000;

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

const checkTokenStatus = async (tokenId) => {
    const token = await Token.getOne(tokenId);
    if (!token) {
        return "invalid";
    }

    await token.expireIfNeeded();
    
    return token.status;
};

const redeemToken = async (tokenId) => {
    const status = await Token.redeem(tokenId);
    return status;
};

export {
    generateTokens,
    checkTokenStatus,
    redeemToken
};