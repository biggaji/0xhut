import { Router } from "express";
import { handleAuthServerCreation, handleAuthServerDeletion, handleIssuingSharedAccessToken } from "../controllers/authServers.controller.js";
import { validateAuthServerSigningKey } from "../@commons/validateSigningKey.js";

const authServerRouter = Router();

authServerRouter.post('/server/create', handleAuthServerCreation);
authServerRouter.post('/server/sat/issue', validateAuthServerSigningKey, handleIssuingSharedAccessToken);
authServerRouter.delete('/server/delete', validateAuthServerSigningKey, handleAuthServerDeletion);

export default authServerRouter;