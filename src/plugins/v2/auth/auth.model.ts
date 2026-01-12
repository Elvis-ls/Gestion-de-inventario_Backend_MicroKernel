/**
 * Modelo de Admin (para creación)
 */
export interface Admin {
  idadmin?: number;
  nombreapellido: string;
  numero?: string;
  usuario: string;
  contrasena: string;
}

/**
 * ✅ NUEVO: Admin completo (retornado por la BD)
 * Garantiza que idadmin siempre existe
 */
export interface AdminDB {
  idadmin: number;          // ✅ Obligatorio
  nombreapellido: string;
  numero?: string;
  usuario: string;
  contrasena?: string;      // Opcional en respuestas (por seguridad)
}

/**
 * ✅ NUEVO: Admin sin contraseña (para respuestas API)
 */
export interface AdminPublic {
  idadmin: number;
  nombreapellido: string;
  numero?: string;
  usuario: string;
}

/**
 * ✅ NUEVO: Credenciales de login
 */
export interface LoginCredentials {
  usuario: string;
  contrasena: string;
}