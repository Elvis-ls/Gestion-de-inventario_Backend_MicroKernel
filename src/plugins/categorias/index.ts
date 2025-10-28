import { CategoriasPlugin } from './categorias.plugin';

// Exportar instancia del plugin
export const categoriasPlugin = new CategoriasPlugin();

// Exportar tipos y servicios si son necesarios
export * from './categorias.model';
export * from './categorias.service';