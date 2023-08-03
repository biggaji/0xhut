import { Router } from "express";
import { handleAuthServerCreation, handleIssuingSharedAccessToken } from "../controllers/authServers.controller.js";
import { validateAuthServerSigningKey } from "../@commons/validateSigningKey.js";

const authServerRouter = Router();

authServerRouter.post('/server/create', handleAuthServerCreation);
authServerRouter.post('/server/identity/token/issue', validateAuthServerSigningKey, handleIssuingSharedAccessToken);

export default authServerRouter;