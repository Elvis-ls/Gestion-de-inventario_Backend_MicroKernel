import { config } from './config/env';
import { Microkernel } from './core/Microkernel';
import { FactorySelector } from './plugins/factories/FactorySelector';

/**
 * Punto de entrada de la aplicación
 * Ahora usa Abstract Factory para cargar versiones de plugins
 */
async function bootstrap() {
  try {
   
    //  PASO 1: Crear instancia del microkernel
    const microkernel = new Microkernel(config.port);

    //  PASO 2: Seleccionar la factory apropiada según configuración
    const factory = FactorySelector.getFactory();

    //  PASO 3: Cargar la familia completa de plugins usando la factory
    await microkernel.loadPluginFamily(factory);

    //  PASO 4: Iniciar el sistema
    await microkernel.start();

    // Log de información útil
    console.log(' [App] Información del sistema:');
    console.log(`  - Versión de plugins: ${factory.getVersion()}`);
    console.log(`  - Puerto: ${config.port}`);
    console.log(`  - Entorno: ${config.nodeEnv}`);
    console.log(`  - Versiones disponibles: ${FactorySelector.getAvailableVersions().join(', ')}`);
    console.log('');
    console.log(' [App] Para cambiar de versión, modifica PLUGIN_VERSION en .env');
    console.log('   - "1.0.0" o "v1" → Autenticación local (sin JWT)');
    console.log('   - "2.0.0" o "v2" → Autenticación JWT (con tokens)');
    console.log('');

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
    console.error(' [App] Error fatal iniciando la aplicación:', error);
    process.exit(1);
  }
}

// Iniciar aplicación
bootstrap();