# Proyecto 3 - Estructura Organizacional

## Descripción
Esta aplicación permite gestionar una estructura organizacional con empleados y sus relaciones jerárquicas y de comunicación. Se visualiza un árbol organizacional y un grafo de conexiones entre empleados.

## Instalación
Para instalar las dependencias del proyecto, asegúrate de tener instalado Node.js y npm. Luego, en la terminal, ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install
```

Esto descargará e instalará todas las dependencias necesarias para el proyecto.

## Ejecución Local
Para correr la aplicación de forma local en modo desarrollo, utiliza el siguiente comando:

```bash
npm run dev
```

## Funcionalidades

### Agregar Empleados
- Se puede agregar un nuevo empleado con los campos: ID, Nombre, Cargo e ID del Supervisor.
- Validaciones:
  - Todos los campos son obligatorios.
  - El ID del supervisor debe existir en la estructura.
- Al agregar un empleado, se crea automáticamente la conexión jerárquica en el grafo.

### Editar Empleados
- Se puede seleccionar un empleado en el grafo para editar sus datos.
- El formulario carga los datos actuales del empleado.
- Se pueden modificar Nombre, Cargo y Supervisor.
- Al guardar, se actualizan tanto el árbol como el grafo.
- Se puede cancelar la edición para volver al modo agregar.

### Gestión de Conexiones
- Se pueden agregar conexiones entre empleados para representar relaciones de comunicación.
- Se pueden eliminar conexiones existentes.
- La interfaz muestra las conexiones actuales y permite gestionarlas fácilmente.
- Al agregar o eliminar conexiones, el grafo se actualiza dinámicamente.

## Uso

1. Para agregar un empleado, complete el formulario y presione "Agregar".
2. Para editar un empleado, haga clic en el nodo correspondiente en el grafo, luego presione "Editar" y modifique los datos en el formulario.
3. Para gestionar conexiones, seleccione un empleado y use el selector para agregar nuevas conexiones o los botones para eliminar conexiones existentes.

## Validaciones Importantes

- No se permite agregar empleados sin un supervisor válido.
- No se permite agregar conexiones duplicadas o conexiones a sí mismo.
- El ID del empleado es único y se usa para identificar nodos y conexiones.

## Tecnologías

- React
- react-d3-tree para visualización del árbol
- vis-network para visualización del grafo
- Estructuras de datos personalizadas para árbol y grafo

## Notas

- El grafo y el árbol se mantienen sincronizados para reflejar la estructura organizacional y las conexiones de comunicación.
- La aplicación está diseñada para ser intuitiva y facilitar la gestión de estructuras complejas.
