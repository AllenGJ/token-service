import bodyParser from "body-parser";
import globalRouter from "../routes/index.js";

export  function expressLoader(app) {
    
    // Setup bodyparsers for various content types
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
    app.use(bodyParser.text({ limit: '50mb' }));

    // Connect global router to root URI
    app.use("/", globalRouter);

    // 404 Handler
    app.use((req, res) => {
        res.status(404).json({
            status: 404,
            message: "Page Not Found.",
        })
    });

    // Error handler called when next() is called with any value
    app.use((err, req, res, next) => {
        // console.error(err);
        res.status(err.status || 500).json({
            status: err.status || 500,
            message: err.message,
            stack: err.stack
        });
    });
}