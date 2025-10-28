# Gestión de Inventario - Backend

Backend para el sistema de gestión de inventario, implementado con una arquitectura de microkernel.

## Requisitos

- Node.js (v14 o superior)
- npm

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Elvis-ls/Gestion-de-inventario_Backend_MicroKernel.git
   ```
2.  Ve al directiorio del projecto:
    ```bash
    cd Gestion-de-inventario_Backend_MicroKernel
    ```
3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Crea un archivo `.env` en la raíz del proyecto y configura las variables de entorno necesarias para la conexión a la base de datos. Puedes usar el archivo `.env.example` como guía.

## Scripts disponibles

- `npm start`: Inicia el servidor en modo de producción.
- `npm run dev`: Inicia el servidor en modo de desarrollo con nodemon, que reiniciará automáticamente el servidor cuando se detecten cambios en los archivos.
- `npm test`: Ejecuta las pruebas.

## Uso

1. Inicia el servidor:
    ```bash
    npm run dev
    ```
2. El backend estará corriendo en `http://localhost:3000` (o el puerto que hayas configurado en tus variables de entorno).

## Arquitectura

El backend sigue una arquitectura de microkernel, donde el núcleo del sistema (`core`) proporciona la funcionalidad básica y los plugins (`plugins`) extienden esta funcionalidad con características específicas.

### Plugins

- **auth**: Autenticación de usuarios.
- **categorias**: Gestión de categorías de productos.
- **database**: Conexión a la base de datos.
- **productos**: Gestión de productos.
- **proveedores**: Gestión de proveedores.

## API Documentation

The API documentation can be found in the following file:
[API_DOCUMENTATION.md](API_DOCUMENTATION.md)
