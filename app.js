import express from "express";

const app = express();
import {expressLoader} from "./src/loaders/express.js";
expressLoader(app);

const server = app.listen(3000, () => {
    console.log("Express server running on port 3000");
});

export default server;