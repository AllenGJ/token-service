import express from "express";

const app = express();
import {expressLoader} from "./src/loaders/express.js";
expressLoader(app);

const server = app.listen(process.env.PORT, () => {
    console.log("Express server running on port", process.env.PORT);
});

export default server;