import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración global del sistema
 */
export const config = {
  // Servidor
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Base de datos
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'inventario_microkernel',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '3xls23435',
  }
};

// Validación de configuración crítica
const validateConfig = () => {
  const requiredVars = [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error(' [Config] Variables de entorno faltantes:', missing.join(', '));
    console.error(' [Config] Asegúrate de tener un archivo .env con todas las variables necesarias');
    process.exit(1);
  }
};

validateConfig();