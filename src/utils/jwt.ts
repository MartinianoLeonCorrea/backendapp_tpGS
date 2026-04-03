const jwt = require('jsonwebtoken');

export interface AuthTokenPayload {
	userId: number;
	email?: string;
	dni?: string;
	iat?: number;
	exp?: number;
}

export function generateToken(payload: AuthTokenPayload): string {
	const secret = process.env.JWT_SECRET || 'SECRET_KEY';
	return jwt.sign(payload, secret);
}

export function verifyToken(token: string): AuthTokenPayload {
	const secret = process.env.JWT_SECRET || 'SECRET_KEY';
	return jwt.verify(token, secret);
}
