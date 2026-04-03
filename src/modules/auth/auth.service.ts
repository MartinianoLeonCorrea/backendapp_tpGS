import { UserService } from '../user/user.service';

export class AuthService {
	constructor(private userService = new UserService()) {}

	async login(email: string, password: string) {
		return this.userService.login(email, password);
	}
}
