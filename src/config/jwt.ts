const SECRET = process.env.JWT_SECRET || 'SECRET_KEY';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const JWT_SECRET: Buffer = Buffer.from(SECRET);
export const JWT_EXPIRES_IN: string = EXPIRES_IN;
