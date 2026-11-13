# Notas para explicar Postulaciones en una entrevista

1. **Separé lógica de interfaz.** `logic.js` no importa React: son funciones puras (`calcularStats`, `necesitaSeguimiento`, `moverEtapa`, `filtrar`), por eso se testean con `node --test` sin navegador.
2. **Fecha inyectable.** Las funciones reciben `hoy` como parámetro (por defecto `new Date()`), así los tests son deterministas.
3. **División por cero.** Las tasas devuelven 0 si no hay postulaciones; hay un test que lo cubre.
4. **Drag & drop nativo.** `draggable`, `onDragStart` guarda el id en `dataTransfer`, `onDrop` despacha `move`. Sin librerías. El `<select>` en cada tarjeta cubre teclado, lectores de pantalla y celulares.
5. **Reducer + localStorage.** Acciones `save`, `delete`, `move`, `reset`; `moverEtapa` también actualiza `ultimoMovimiento`, que es lo que usa la alerta de seguimiento.
6. **Qué mejoraría:** backend real, recordatorios por mail, importar ofertas desde un link, historial de movimientos por postulación.
7. **IA:** la usé como asistente; entiendo el código y puedo modificarlo en vivo.
