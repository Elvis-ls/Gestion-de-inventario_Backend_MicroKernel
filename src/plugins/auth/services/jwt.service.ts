// src/plugins/auth/services/jwt.service.ts

import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { JwtPayload, RefreshTokenPayload, AuthTokens } from '../types/jwt.types';

/**
 * Servicio para gestionar la creación, verificación y manejo de JWT
 */
export class JwtService {
  /**
   * Genera un token de acceso
   */
  static generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    try {
      const token = jwt.sign(
        payload as any,
        jwtConfig.secret as string,
        {
          expiresIn: jwtConfig.expiresIn,
          algorithm: jwtConfig.algorithm,
          issuer: jwtConfig.issuer,
          audience: jwtConfig.audience,
        } as SignOptions
      );
      
      return token;
    } catch (error) {
      console.error('[JwtService] Error generando access token:', error);
      throw new Error('Error generando token de acceso');
    }
  }

  /**
   * Genera un refresh token
   */
  static generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp' | 'tokenType'>): string {
    try {
      const refreshPayload: Omit<RefreshTokenPayload, 'iat' | 'exp'> = {
        ...payload,
        tokenType: 'refresh',
      };

      const token = jwt.sign(
        refreshPayload as any,
        jwtConfig.refreshSecret as string,
        {
          expiresIn: jwtConfig.refreshExpiresIn,
          algorithm: jwtConfig.algorithm,
          issuer: jwtConfig.issuer,
          audience: jwtConfig.audience,
        } as SignOptions
      );
      
      return token;
    } catch (error) {
      console.error('[JwtService] Error generando refresh token:', error);
      throw new Error('Error generando refresh token');
    }
  }

  /**
   * Genera ambos tokens (access y refresh)
   */
  static generateTokens(userId: number, usuario: string, email?: string): AuthTokens {
    const accessToken = this.generateAccessToken({
      sub: userId,
      usuario,
      email,
    });

    const refreshToken = this.generateRefreshToken({
      sub: userId,
      usuario,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: jwtConfig.expiresIn,
      tokenType: 'Bearer',
    };
  }

  /**
   * Verifica y decodifica un access token
   */
  static verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret as string, {
        algorithms: [jwtConfig.algorithm],
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      } as VerifyOptions) as unknown as JwtPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expirado');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token inválido');
      }
      throw new Error('Error verificando token');
    }
  }

  /**
   * Verifica y decodifica un refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, jwtConfig.refreshSecret as string, {
        algorithms: [jwtConfig.algorithm],
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      } as VerifyOptions) as unknown as RefreshTokenPayload;

      // Verificar que sea un refresh token
      if (decoded.tokenType !== 'refresh') {
        throw new Error('Token no es de tipo refresh');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expirado');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Refresh token inválido');
      }
      throw error;
    }
  }

  /**
   * Decodifica un token sin verificar (útil para debugging)
   * ⚠️ NO usar para autenticación
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token, { complete: false }) as JwtPayload | null;
      return decoded;
    } catch (error) {
      console.error('[JwtService] Error decodificando token:', error);
      return null;
    }
  }

  /**
   * Extrae el token del header Authorization
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Verifica si un token está expirado sin lanzar error
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }
}