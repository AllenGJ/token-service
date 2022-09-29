import client from "../loaders/redis.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);

/**
 * Generic model that abstracts redis specifics
 */
class Model {
    constructor(id) {
        this.id = id ?? Model.generateId();
    }
    /**
     * Generates a non-sequential string
     * @returns {string} Alphanumeric string
     */
    static generateId () {
        return nanoid();
    }
    /**
     * Creates an object in the datastore.
     * @param {object} object Object that is to be added as hash to redis datastore
     * @returns {object} Object populated with id field 
     */
    static async addOne(object) {
        const id = Model.generateId();
        const entityType = this.name;
        await client.hSet(`${entityType}:${id}`, object);
        return {id, ...object};
    }

    toObject() {
        return {...this};
    }
}

export default Model;