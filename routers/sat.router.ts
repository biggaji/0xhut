import { Router } from "express";
import { handleSharedAccessTokenRevoke } from "../controllers/sat.controller.js";
import { validateAuthServerSigningKey } from "../@commons/validateSigningKey.js";

const sharedAccessTokenRouter = Router();

sharedAccessTokenRouter.post('/sat/revoke', validateAuthServerSigningKey, handleSharedAccessTokenRevoke);

export default sharedAccessTokenRouter;