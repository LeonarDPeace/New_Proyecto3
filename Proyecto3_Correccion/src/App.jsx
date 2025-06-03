import { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { TreeNode } from './utils/TreeNode';
import { Graph } from './utils/Graph';
import './App.css';

function App() {
  // Inicializar con un CEO
  const ceoInicial = new TreeNode('1', 'Juan Pérez', 'CEO');
  const [arbolOrganizacional, setArbolOrganizacional] = useState(ceoInicial);

  // Inicializar grafo con CEO
  const grafoInicial = new Graph();
  grafoInicial.agregarNodo('1', { nombre: 'Juan Pérez', cargo: 'CEO' });
  const [grafoComunicacion, setGrafoComunicacion] = useState(grafoInicial);

  // Estado para el empleado seleccionado y formulario
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({
    id: '',
    nombre: '',
    cargo: '',
    idSupervisor: ''
  });

  // Inicializar visualización de red
  useEffect(() => {
    if (!grafoComunicacion) return;

    const contenedor = document.getElementById('network-container');
    if (!contenedor) return;

    const datos = grafoComunicacion.convertirAFormatoVis();
    const opciones = {
      nodes: {
        shape: 'box',
        margin: 10,
        font: {
          size: 14
        }
      },
      edges: {
        width: 2,
        smooth: {
          type: 'continuous'
        }
      },
      physics: {
        stabilization: true,
        barnesHut: {
          gravitationalConstant: -2000,
          springConstant: 0.04
        }
      }
    };

    const red = new Network(contenedor, datos, opciones);
    red.on('click', function(params) {
      if (params.nodes.length > 0) {
        const idNodo = params.nodes[0];
        const empleado = arbolOrganizacional?.buscarNodo(idNodo);
        if (empleado) {
          setEmpleadoSeleccionado(empleado);
        }
      }
    });

    return () => {
      red.destroy();
    };
  }, [grafoComunicacion, arbolOrganizacional]);

  /**
   * Maneja el envío del formulario para agregar o editar un empleado
   */
  const manejarEnvioFormulario = (e) => {
    e.preventDefault();
    const { id, nombre, cargo, idSupervisor } = datosFormulario;

    if (!id || !nombre || !cargo) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (modoEdicion) {
      // Modo edición
      const empleadoExistente = arbolOrganizacional.buscarNodo(id);
      if (empleadoExistente) {
        empleadoExistente.nombre = nombre;
        empleadoExistente.cargo = cargo;
        

        const nodoGrafo = grafoComunicacion.nodos.get(id);
        if (nodoGrafo) {
          nodoGrafo.nombre = nombre;
          nodoGrafo.cargo = cargo;
        }
        
        setArbolOrganizacional(arbolOrganizacional.clonar());
        setGrafoComunicacion(grafoComunicacion.clonar());
        setModoEdicion(false);
        alert('Empleado actualizado correctamente');
      }
    } else {
      // Modo agregar
      if (!idSupervisor) {
        alert('El ID del supervisor es obligatorio');
        return;
      }

      const nuevoEmpleado = new TreeNode(id, nombre, cargo);

      if (!arbolOrganizacional) {
        setArbolOrganizacional(nuevoEmpleado);
      } else if (idSupervisor) {
        const supervisor = arbolOrganizacional.buscarNodo(idSupervisor);
        if (supervisor) {
          supervisor.agregarSubordinado(nuevoEmpleado);
          setArbolOrganizacional(arbolOrganizacional.clonar());
        } else {
          alert(`No se encontró un supervisor con ID: ${idSupervisor}`);
          return;
        }
      }

      grafoComunicacion.agregarNodo(id, { nombre, cargo });
      if (idSupervisor) {
        grafoComunicacion.agregarArista(idSupervisor, id);
      }
      setGrafoComunicacion(grafoComunicacion.clonar());
    }

    setDatosFormulario({
      id: '',
      nombre: '',
      cargo: '',
      idSupervisor: ''
    });
  };

  /**
   * Agrega una conexión entre dos empleados
   */
  const manejarAgregarConexion = (idOrigen, idDestino) => {
    if (idOrigen && idDestino && idOrigen !== idDestino) {
      grafoComunicacion.agregarArista(idOrigen, idDestino);
      setGrafoComunicacion(grafoComunicacion.clonar());
    }
  };

  /**
   * Elimina una conexión entre dos empleados
   */
  const manejarEliminarConexion = (idOrigen, idDestino) => {
    grafoComunicacion.eliminarArista(idOrigen, idDestino);
    setGrafoComunicacion(grafoComunicacion.clonar());
  };

  return (
    <div className="container">
      <h1>Estructura Organizacional</h1>
      
      {/* Formulario de Empleado */}
      <div className="card">
        <h2>{modoEdicion ? 'Editar Empleado' : 'Agregar Empleado'}</h2>
        <form onSubmit={manejarEnvioFormulario}>
          <div className="form-group">
            <label>ID:</label>
            <input
              type="text"
              className="input"
              value={datosFormulario.id}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, id: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              className="input"
              value={datosFormulario.nombre}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, nombre: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Cargo:</label>
            <input
              type="text"
              className="input"
              value={datosFormulario.cargo}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, cargo: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>ID del Supervisor:</label>
            <input
              type="text"
              className="input"
              value={datosFormulario.idSupervisor}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, idSupervisor: e.target.value })}
            />
          </div>
          <button type="submit" className="button">
            {modoEdicion ? 'Guardar Cambios' : 'Agregar'}
          </button>
          {modoEdicion && (
            <button
              type="button"
              className="button"
              onClick={() => {
                setModoEdicion(false);
                setDatosFormulario({
                  id: '',
                  nombre: '',
                  cargo: '',
                  idSupervisor: ''
                });
              }}
            >
              Cancelar Edición
            </button>
          )}
        </form>
      </div>

      {/* Visualización del Árbol */}
      <div className="tree-container">
        {arbolOrganizacional && (
          <Tree
            data={arbolOrganizacional.convertirAFormatoD3()}
            orientation="vertical"
            pathFunc="step"
            translate={{ x: 400, y: 50 }}
            separation={{ siblings: 2, nonSiblings: 3 }}
            nodeSize={{ x: 200, y: 100 }}
          />
        )}
      </div>

      {/* Visualización de la Red */}
      <div className="network-container" id="network-container"></div>

      {/* Gestión de Conexiones */}
      {empleadoSeleccionado && (
        <div className="card">
          <h2>Gestionar Empleado</h2>
          <div className="form-group">
            <h3>Datos del Empleado</h3>
            <p>ID: {empleadoSeleccionado.id}</p>
            <p>Nombre: {empleadoSeleccionado.nombre}</p>
            <p>Cargo: {empleadoSeleccionado.cargo}</p>
            <button
              className="button"
              onClick={() => {
                setModoEdicion(true);
                setDatosFormulario({
                  id: empleadoSeleccionado.id,
                  nombre: empleadoSeleccionado.nombre,
                  cargo: empleadoSeleccionado.cargo,
                  idSupervisor: empleadoSeleccionado.supervisor?.id || ''
                });
              }}
            >
              Editar
            </button>
          </div>
          <h3>Gestionar Conexiones</h3>
          <div className="form-group">
            <label>Conectar con:</label>
            <select
              className="input"
              onChange={(e) => manejarAgregarConexion(empleadoSeleccionado.id, e.target.value)}
              value=""
            >
              <option value="">Seleccionar empleado...</option>
              {grafoComunicacion.obtenerTodosLosNodos()
                .filter(nodo => nodo.id !== empleadoSeleccionado.id)
                .map(nodo => (
                  <option key={nodo.id} value={nodo.id}>
                    {nodo.nombre} - {nodo.cargo}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <h3>Conexiones actuales:</h3>
            <ul>
              {Array.from(grafoComunicacion.obtenerConexiones(empleadoSeleccionado.id)).map(idConectado => {
                const nodo = grafoComunicacion.nodos.get(idConectado);
                return (
                  <li key={idConectado}>
                    {nodo.nombre} - {nodo.cargo}
                    <button
                      className="button"
                      onClick={() => manejarEliminarConexion(empleadoSeleccionado.id, idConectado)}
                    >
                      Eliminar
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="form-group">
            <label>Agregar nueva conexión:</label>
            <select
              className="input"
              onChange={(e) => manejarAgregarConexion(empleadoSeleccionado.id, e.target.value)}
              value=""
            >
              <option value="">Seleccionar empleado...</option>
              {grafoComunicacion.obtenerTodosLosNodos()
                .filter(nodo => nodo.id !== empleadoSeleccionado.id && !grafoComunicacion.obtenerConexiones(empleadoSeleccionado.id).has(nodo.id))
                .map(nodo => (
                  <option key={nodo.id} value={nodo.id}>
                    {nodo.nombre} - {nodo.cargo}
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
