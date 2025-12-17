// src/plugins/auth/config/jwt.config.ts

/**
 * Configuración de JWT
 * Contiene todas las constantes y configuraciones relacionadas con tokens
 */

export const jwtConfig = {
  // Secreto para firmar tokens de acceso
  secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
  
  // Tiempo de expiración del token de acceso
  expiresIn: process.env.JWT_EXPIRES_IN || '24h', // 24 horas
  
  // Secreto para tokens de refresh (debe ser diferente al de access)
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_in_production',
  
  // Tiempo de expiración del refresh token
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // 7 días
  
  // Algoritmo de firma
  algorithm: 'HS256' as const,
  
  // Emisor del token
  issuer: 'inventario-microkernel',
  
  // Audiencia
  audience: 'inventario-api',
};

/**
 * Valida que las configuraciones críticas de JWT estén presentes
 */
export const validateJwtConfig = (): void => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'default_secret_change_in_production') {
    console.warn('⚠️  [JWT Config] ADVERTENCIA: Usando JWT_SECRET por defecto. ¡Configura un secreto seguro en producción!');
  }
  
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'default_refresh_secret_change_in_production') {
    console.warn('⚠️  [JWT Config] ADVERTENCIA: Usando JWT_REFRESH_SECRET por defecto. ¡Configura un secreto seguro en producción!');
  }
  
  // Validar que los secretos no sean iguales
  if (jwtConfig.secret === jwtConfig.refreshSecret) {
    throw new Error('[JWT Config] ERROR: JWT_SECRET y JWT_REFRESH_SECRET deben ser diferentes');
  }
  
  console.log('✓ [JWT Config] Configuración de JWT validada correctamente');
};