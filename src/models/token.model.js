import client from "../loaders/redis.js"; 
import Model from "./index.js";
const tokenTtl = process.env.TOKEN_TTL;
/**
 * Token class
 */
class Token extends Model {
    constructor ({id, text, created, status}) {
        super(id);
        this.created = created ?? Date.now();
        this.status = status ?? "available";
    }

    static instantiate(object) {
        return Object.assign(Object.create(this.prototype), object);
    }

    /**
     * Fetches a token corresponding to the identifier from the datastore.
     * @param {string} id Identifier of the token
     * @returns {Token} Fetched token
     */
    static async getOne (id) {
        const key = `Token:${id}`;
        const object = await client.hGetAll(key);
        return object.created ? new Token({...object, id}) : undefined;
    }
    /**
     * Checks a token for expiry and sets status accordingly.
     */
    async expireIfNeeded() {
        if (this.status == "available" && Date.now() - this.created > tokenTtl) {
            this.status = "expired";
            await this.save();
        }
    }
    /**
     * Saves a token to the datastore.
     */
    async save() {
        const key = `Token:${this.id}`;
        delete this.text;
        const result = await client.hSet(key, this);       // Convert Token instance to plain object for hSet support
    }
    /**
     * Redeems a token if it is not expired/redeemed already.
     * This business logic is written in the data layer (vs. service) to make use of the "watch" redis functionality.
     * This is for maintaining atomicity of the redeem operation.
     * @param {string} id   Identifier of the token
     * @returns {string}    Status of the redeem operation - "ok" if successful.    
     */
    static async redeem(id) {
        const key = `Token:${id}`;
        let token = await Token.getOne(id);
        if (!token) {
            return "invalid";
        }
        
        await token.expireIfNeeded();
        
        if (token.status == "available") {
            // Begin watching key for changes.
            client.watch(key);
            await client.multi()                    // all operations after multi() are merely queued to be triggered on calling exec()
                .hSet(key, "status", "redeemed")    // If the token is changed before 'watch' and 'exec', the operation is dropped.
                .exec()
            token.status = "ok";
        }
        return token.status;
    }
};

export default Token;