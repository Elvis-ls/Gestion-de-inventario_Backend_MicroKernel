/**
 * Sistema de eventos para comunicación entre plugins
 * Implementa patrón Pub/Sub
 */
export class EventBus {
  private listeners: Map<string, Array<(data: any) => void>>;

  constructor() {
    this.listeners = new Map();
  }

  /**
   * Suscribe un listener a un evento
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    console.log(` [EventBus] Listener registrado para evento: ${event}`);
  }

  /**
   * Emite un evento a todos los listeners suscritos
   */
  emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      console.log(` [EventBus] Emitiendo evento: ${event}`);
      eventListeners.forEach(callback => callback(data));
    }
  }

  /**
   * Remueve un listener de un evento
   */
  off(event: string, callback: (data: any) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
        console.log(` [EventBus] Listener removido del evento: ${event}`);
      }
    }
  }

  /**
   * Remueve todos los listeners de un evento
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
      console.log(`  [EventBus] Todos los listeners removidos del evento: ${event}`);
    } else {
      this.listeners.clear();
      console.log(` [EventBus] Todos los listeners removidos`);
    }
  }
}