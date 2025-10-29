import express, { Express, Router } from 'express';
import cors from 'cors';

/**
 * Servidor Express básico
 */
export class Server {
  private app: Express;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.setupMiddlewares();
  }

  /**
   * Configura middlewares básicos
   */
  private setupMiddlewares(): void {

    // CORS - Habilita CORS para todas las peticiones
    this.app.use(cors());

    // Parsear JSON y URL-encoded
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Registra rutas de un plugin
   */
  public registerRoutes(basePath: string, router: Router): void {
    this.app.use(basePath, router);
    console.log(`🛣️  [Server] Rutas registradas en: ${basePath}`);
  }

  /**
   * Inicia el servidor
   */
  public start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log(`\n [Server] Servidor corriendo en http://localhost:${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Obtiene la instancia de Express
   */
  public getApp(): Express {
    return this.app;
  }
}