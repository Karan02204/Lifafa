import type { Request, Response } from "express";

export class UserController {
  profile = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      currentUser: req.currentUser,
    });
  };
}

export const userController = new UserController();