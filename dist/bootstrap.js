import express, {} from "express";
import router from "./modules/routes";
import { DBConnection } from "./DB/config/connctDB";
import { UserModel } from "./DB/models/user.model";
const app = express();
const bootstrap = async () => {
    const port = process.env.PORT || 5000;
    app.use(express.json());
    app.use("/api/v1", router);
    await DBConnection;
    app.use((err, req, res, next) => {
        res.status(err.statusCode || 500).json({
            msg: err.message,
            stack: err.stack,
            status: err.statusCode || 500
        });
    });
    app.listen(port, () => {
        console.log("server running on port", port);
    });
};
export default bootstrap;
