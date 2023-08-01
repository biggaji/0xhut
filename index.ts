import { config } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  config();
}
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import startDb from "./@commons/db";
import userAuthRouter from "./routers/user.router.js";
import authServerRouter from "./routers/authServer.router";
import ErrorHelper from "./@commons/errorHelper";

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors({ origin: "*" }));

// start database
startDb()
.then();

app.get('/', function(req: Request, response: Response, next: NextFunction) {
  return response.json({ msg: 'hello world'})
})
app.use('/id', userAuthRouter);
app.use('/auth', authServerRouter);

// Global error middleware, handles and reformats error object
app.use(function(error: Error, request: Request, response: Response, next: NextFunction) {
  const error_json_formater = ErrorHelper.ProcessError(error);
  return response.status(error_json_formater.code).json(error_json_formater);
});

const PORT = parseInt(process.env.PORT!) || 3000;
app.listen(PORT, function() {
  console.log(`🚀 Server ready at port: ${PORT}`);
})