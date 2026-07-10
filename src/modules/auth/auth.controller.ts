import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.login(identifier, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
