import { Router } from "express";
import { handleAuthServerCreation } from "../controllers/authServers.controller";

const authServerRouter = Router();

authServerRouter.post('/server/create', handleAuthServerCreation);

export default authServerRouter;