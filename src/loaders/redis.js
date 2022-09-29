import { createClient } from "redis";

const client = createClient({
    socket: {
        host: "localhost",
        port: "6379"
    }
});

client.on('connect', () => console.log("Connected to Redis Server"));
client.on('error', (err) => console.log("Redis Client Error", err));

await client.connect();

export default client;