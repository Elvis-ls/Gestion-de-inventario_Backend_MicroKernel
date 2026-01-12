import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPayload {
  sub: number;        // userId
  usuario: string;
  tokenType?: string; // solo presente en el refresh token
  iat?: number;       // issued at (opcional, agregado por JWT)
  exp?: number;       // expiration (opcional, agregado por JWT)
}

export class JwtService {
  static generateTokens(userId: number, usuario: string) {
    const accessToken = jwt.sign(
      { sub: userId, usuario },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    const refreshToken = jwt.sign(
      { sub: userId, usuario, tokenType: 'refresh' },
      JWT_REFRESH_SECRET as string,
      { expiresIn: JWT_REFRESH_EXPIRES_IN } as SignOptions
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_EXPIRES_IN,
      tokenType: 'Bearer'
    };
  }

  static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET as string);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  static verifyRefreshToken(token: string): any {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET as string) as any;
      if (decoded.tokenType !== 'refresh') {
        throw new Error('Token no es de tipo refresh');
      }
      return decoded;
    } catch (error) {
      throw new Error('Refresh token inválido');
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    return parts[1];
  }
}