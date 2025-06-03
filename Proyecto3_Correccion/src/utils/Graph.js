export class Graph {
  constructor() {
    this.nodos = new Map();
    this.aristas = new Map();
  }

  /**
   * Agrega un nuevo nodo al grafo
   * @param {string} id
   * @param {Object} datos
   */
  agregarNodo(id, datos) {
    this.nodos.set(id, datos);
    if (!this.aristas.has(id)) {
      this.aristas.set(id, new Set());
    }
  }

  /**
   * Elimina un nodo del grafo y todas sus conexiones
   * @param {string} id
   */
  eliminarNodo(id) {
    this.nodos.delete(id);
    this.aristas.delete(id);
    for (const [idNodo, conexiones] of this.aristas) {
      conexiones.delete(id);
    }
  }

  /**
   * Agrega una conexión entre dos nodos
   * @param {string} idOrigen
   * @param {string} idDestino
   */
  agregarArista(idOrigen, idDestino) {
    if (this.nodos.has(idOrigen) && this.nodos.has(idDestino)) {
      this.aristas.get(idOrigen).add(idDestino);
      this.aristas.get(idDestino).add(idOrigen);
    }
  }

  /**
   * Elimina una conexión entre dos nodos
   * @param {string} idOrigen
   * @param {string} idDestino
   */
  eliminarArista(idOrigen, idDestino) {
    if (this.aristas.has(idOrigen)) {
      this.aristas.get(idOrigen).delete(idDestino);
    }
    if (this.aristas.has(idDestino)) {
      this.aristas.get(idDestino).delete(idOrigen);
    }
  }

  /**
   * Obtiene todas las conexiones de un nodo
   * @param {string} idNodo
   * @returns {Set}
   */
  obtenerConexiones(idNodo) {
    return this.aristas.get(idNodo) || new Set();
  }

  /**
   * Convierte el grafo al formato requerido por vis-network
   * @returns {Object}
   */
  convertirAFormatoVis() {
    const nodos = Array.from(this.nodos.entries()).map(([id, datos]) => ({
      id: id,
      label: `${datos.nombre}\n${datos.cargo}`,
      color: {
        background: '#B5D8FF',
        border: '#4A90E2'
      }
    }));

    const aristas = [];
    for (const [idOrigen, conexiones] of this.aristas) {
      for (const idDestino of conexiones) {
        if (idOrigen < idDestino) {
          aristas.push({
            from: idOrigen,
            to: idDestino,
            color: '#FFB5B5'
          });
        }
      }
    }

    return { nodes: nodos, edges: aristas };
  }

  /**
   * Obtiene todos los nodos del grafo
   * @returns {Array}
   */
  obtenerTodosLosNodos() {
    return Array.from(this.nodos.entries()).map(([id, datos]) => ({
      id,
      ...datos
    }));
  }

  /**
   * Crea una copia profunda del grafo, manteniendo la estructura y los métodos
   * @returns {Graph}
   */
  clonar() {
    const clon = new Graph();
    
    for (const [id, datos] of this.nodos) {
      clon.agregarNodo(id, { ...datos });
    }
    
    for (const [idOrigen, conexiones] of this.aristas) {
      for (const idDestino of conexiones) {
        if (idOrigen < idDestino) {
          clon.agregarArista(idOrigen, idDestino);
        }
      }
    }
    
    return clon;
  }

  // Métodos de compatibilidad con nombres en inglés para mantener funcionalidad existente
  addNode(id, data) { return this.agregarNodo(id, data); }
  removeNode(id) { return this.eliminarNodo(id); }
  addEdge(fromId, toId) { return this.agregarArista(fromId, toId); }
  removeEdge(fromId, toId) { return this.eliminarArista(fromId, toId); }
  getConnections(nodeId) { return this.obtenerConexiones(nodeId); }
  toVisFormat() { return this.convertirAFormatoVis(); }
  getAllNodes() { return this.obtenerTodosLosNodos(); }
}
