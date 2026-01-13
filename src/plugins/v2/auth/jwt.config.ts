export const validateJwtConfig = (): void => {
  if (!process.env.JWT_SECRET) {
    console.warn('  [JWT] ADVERTENCIA: JWT_SECRET no configurado');
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    console.warn('  [JWT] ADVERTENCIA: JWT_REFRESH_SECRET no configurado');
  }
  console.log(' [JWT] Configuración validada');
};