import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const result = await authService.login(email, password);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
