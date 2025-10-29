import { config } from './config/env';
import { Microkernel } from './core/Microkernel';

// Importar plugins
import { databasePlugin } from './plugins/database';
import { categoriasPlugin } from './plugins/categorias';
import { proveedoresPlugin } from './plugins/proveedores';
import { productosPlugin } from './plugins/productos';
import { authPlugin } from './plugins/auth';

/**
 * Punto de entrada de la aplicación
 */
async function bootstrap() {
  try {
    // Crear instancia del microkernel
    const microkernel = new Microkernel(config.port);

    // Registrar plugins en orden (respetando dependencias)
    // 1. Database primero (otros plugins dependen de él)
    await microkernel.registerPlugin(databasePlugin);

    // 2. Luego los demás plugins
    await microkernel.registerPlugin(categoriasPlugin);
    await microkernel.registerPlugin(proveedoresPlugin);
    await microkernel.registerPlugin(productosPlugin);
    await microkernel.registerPlugin(authPlugin);

    // Iniciar el sistema
    await microkernel.start();

    // Manejar señales de cierre graceful
    process.on('SIGINT', async () => {
      console.log('\n\n Señal SIGINT recibida. Cerrando aplicación...');
      await microkernel.shutdown();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n\n Señal SIGTERM recibida. Cerrando aplicación...');
      await microkernel.shutdown();
      process.exit(0);
    });

  } catch (error) {
    console.error(' Error fatal iniciando la aplicación:', error);
    process.exit(1);
  }
}

// Iniciar aplicación
bootstrap();