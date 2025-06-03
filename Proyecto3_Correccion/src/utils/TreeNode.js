export class TreeNode {
  constructor(id, nombre, cargo) {
    this.id = id;
    this.nombre = nombre;
    this.cargo = cargo;
    this.subordinados = [];
  }

  /**
   * Agrega un subordinado al nodo actual
   * @param {TreeNode} nodo
   */
  agregarSubordinado(nodo) {
    this.subordinados.push(nodo);
  }

  /**
   * Elimina un subordinado por su ID
   * @param {string} id
   */
  eliminarSubordinado(id) {
    const indice = this.subordinados.findIndex(sub => sub.id === id);
    if (indice !== -1) {
      this.subordinados.splice(indice, 1);
    }
  }

  /**
   * Obtiene el número total de subordinados (incluyendo subordinados de subordinados)
   * @returns {number}
   */
  obtenerConteoSubordinados() {
    let conteo = this.subordinados.length;
    for (const subordinado of this.subordinados) {
      conteo += subordinado.obtenerConteoSubordinados();
    }
    return conteo;
  }

  /**
   * Busca un nodo por su ID en el árbol
   * @param {string} id
   * @returns {TreeNode|null}
   */
  buscarNodo(id) {
    if (this.id === id) {
      return this;
    }
    for (const subordinado of this.subordinados) {
      const encontrado = subordinado.buscarNodo(id);
      if (encontrado) {
        return encontrado;
      }
    }
    return null;
  }

  /**
   * Crea una copia profunda del árbol, manteniendo la estructura y los métodos
   * @returns {TreeNode}
   */
  clonar() {
    const clon = new TreeNode(this.id, this.nombre, this.cargo);
    clon.subordinados = this.subordinados.map(sub => sub.clonar());
    return clon;
  }

  /**
   * Convierte el árbol al formato requerido por react-d3-tree
   * @returns {Object} - Objeto con el formato para react-d3-tree
   */
  convertirAFormatoD3() {
    return {
      name: `${this.nombre}\n${this.cargo}`,
      attributes: {
        id: this.id,
        conteoSubordinados: this.obtenerConteoSubordinados()
      },
      children: this.subordinados.map(sub => sub.convertirAFormatoD3())
    };
  }

  // Métodos de compatibilidad con nombres en inglés para mantener funcionalidad existente
  addSubordinate(node) { return this.agregarSubordinado(node); }
  removeSubordinate(id) { return this.eliminarSubordinado(id); }
  getSubordinateCount() { return this.obtenerConteoSubordinados(); }
  findNode(id) { return this.buscarNodo(id); }
  toD3Format() { return this.convertirAFormatoD3(); }
}
