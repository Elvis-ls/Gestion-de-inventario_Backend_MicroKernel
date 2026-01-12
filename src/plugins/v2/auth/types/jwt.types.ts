// src/plugins/auth/types/jwt.types.ts

/**
 * Payload del JWT - información que se almacena en el token
 */
export interface JwtPayload {
  // ID del usuario
  sub: number;
  
  // Usuario
  usuario: string;
  
  // Email (opcional)
  email?: string;
  
  // Rol del usuario (opcional para futuras implementaciones)
  role?: string;
  
  // Fecha de emisión (añadida automáticamente por jsonwebtoken)
  iat?: number;
  
  // Fecha de expiración (añadida automáticamente por jsonwebtoken)
  exp?: number;
}

/**
 * Respuesta de autenticación con tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  tokenType: 'Bearer';
}

/**
 * Respuesta completa de login
 */
export interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      usuario: string;
      nombreapellido: string;
      numero?: string;
    };
    tokens: AuthTokens;
  };
  message: string;
}

/**
 * Payload del Refresh Token
 */
export interface RefreshTokenPayload {
  sub: number;
  usuario: string;
  tokenType: 'refresh';
  iat?: number;
  exp?: number;
}