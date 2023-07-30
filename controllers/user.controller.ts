import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.js";
const userService = new UserService();

export async function handleCreateUser(req: Request, response: Response, next: NextFunction) {
  try {
    const query = req.body;
    const result = await userService.createUser(query);
    return response.status(201).json({
      success: true,
      message: `User identity created`,
      id: result._id
    })
  } catch (error) {
    next(error);
  }
}