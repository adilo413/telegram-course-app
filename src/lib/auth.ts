import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const TOKEN_COOKIE_NAME = 'auth_token';

export interface JwtPayload {
  sub: string; // admin user id
  username: string;
  iat?: number;
  exp?: number;
}

export function signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresIn: string = '30d'): string {
  const secret = process.env.JWT_SECRET || '';
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt(token: string | undefined): JwtPayload | null {
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET || '';
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | undefined {
  const cookie = req.cookies.get(TOKEN_COOKIE_NAME);
  return cookie?.value;
}

export function getTokenCookieName(): string {
  return TOKEN_COOKIE_NAME;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}


