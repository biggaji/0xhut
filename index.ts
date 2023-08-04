import { config } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  config();
}
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import startDb from "./@commons/db.js";
import userAuthRouter from "./routers/user.router.js";
import authServerRouter from "./routers/authServer.router.js";
import ErrorHelper from "./@commons/errorHelper.js";
import sharedAccessTokenRouter from "./routers/sat.router.js";

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors({ origin: "*" }));

// start database
startDb()
.then();

app.get('/', function(req: Request, response: Response, next: NextFunction) {
  return response.json({ success: true, message: 'Hello World from 0xIdentity'});
});

app.use('/identity', userAuthRouter);
app.use('/identity', authServerRouter);
app.use('/identity', sharedAccessTokenRouter);


// Global error middleware, handles and reformats error object
app.use(function(error: Error, request: Request, response: Response, next: NextFunction) {
  console.log(error);
  const error_json_formater = ErrorHelper.ProcessError(error);
  return response.status(error_json_formater.code).json(error_json_formater);
});

const PORT = parseInt(process.env.PORT!) || 3000;
app.listen(PORT, function() {
  console.log(`🚀 Server ready at port: ${PORT}`);
})