import { PluginFactory } from '../../core/factories/PluginFactory';
import { PluginFactoryV1 } from './PluginFactoryV1';
import { PluginFactoryV2 } from './PluginFactoryV2';

/**
 * Selector de Factory según configuración
 * Determina qué versión de plugins usar
 */
export class FactorySelector {
  /**
   * Obtiene la factory apropiada según la versión configurada
   */
  static getFactory(version?: string): PluginFactory {
    const selectedVersion = version || process.env.PLUGIN_VERSION || '2.0.0';
    
    console.log(' [FactorySelector] Seleccionando versión de plugins:', selectedVersion);
    
    switch (selectedVersion) {
      case '1.0.0':
      case 'v1':
      case 'local':
        console.log(' [FactorySelector] Usando PluginFactoryV1 (Local/Básico)');
        return new PluginFactoryV1();
      
      case '2.0.0':
      case 'v2':
      case 'jwt':
      default:
        console.log(' [FactorySelector] Usando PluginFactoryV2 (JWT/Avanzado)');
        return new PluginFactoryV2();
    }
  }

  /**
   * Lista todas las versiones disponibles
   */
  static getAvailableVersions(): string[] {
    return ['1.0.0', '2.0.0'];
  }

  /**
   * Verifica si una versión existe
   */
  static isVersionAvailable(version: string): boolean {
    return this.getAvailableVersions().includes(version);
  }
}

export default FactorySelector;