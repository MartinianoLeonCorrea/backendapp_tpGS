import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {

  constructor(private userService: UserService) { }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const result = await this.userService.login(email, password);

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}