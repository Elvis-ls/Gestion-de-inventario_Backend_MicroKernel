import { Pool } from 'pg';

export interface DatabasePlugin {
  name: string;
  version: string;
  initialize: (core: any) => Promise<void>;
}

const databasePlugin: DatabasePlugin = {
  name: 'database',
  version: '2.0.0',

  initialize: async (core: any) => {
    try {
      // Usa las mismas variables de entorno que v1
      const pool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });

      const client = await pool.connect();
      console.log('✅ Conexión a la base de datos exitosa (v2)');
      client.release();

      core.database = pool;

      console.log('✅ Plugin Database v2 inicializado');
    } catch (error) {
      console.error('❌ Error al inicializar plugin Database v2:', error);
      throw error;
    }
  },
};

export default databasePlugin;