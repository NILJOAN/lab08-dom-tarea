# Tarea: Mi componente interactivo

## Componente elegido

Elegi un **registro de notas de estudiantes** con escala de 0 a 20. El usuario escribe un nombre y una nota; la pagina guarda las notas de cada estudiante, calcula su promedio y dice si esta **Aprobado** (promedio de 13 o mas) o **Desaprobado**. Tambien se puede buscar por nombre y borrar un estudiante.

- La nota minima para aprobar esta en la constante `NOTA_MINIMA`, asi que se puede cambiar en un solo lugar.
- Si se escribe un nombre que ya existe (sin importar mayusculas o minusculas, por ejemplo "ana" y "Ana"), la nota se suma al mismo estudiante en lugar de crear otra fila.
- Los datos viven solo en memoria: al recargar la pagina la lista se vacia, porque no use almacenamiento del navegador.
- Para mostrar lo que escribe el usuario use `textContent` y no `innerHTML`, de modo que si alguien escribe etiquetas HTML como nombre se ven como texto y no se ejecutan.

## Version 1: solo DOM

**Que agregue:** una pagina con un titulo y una lista vacia (`#lista`). Los estudiantes estan escritos en el codigo como un arreglo fijo. JavaScript recorre el arreglo, calcula el promedio de cada uno y crea con `createElement` un `li` con su informacion y su estado (Aprobado o Desaprobado). Tambien cambie el color del titulo con `style.color` y use `classList.add` para pintar el estado.

**Por que:** queria comprobar primero lo mas basico, que JavaScript pueda dibujar la lista desde cero sin escribir los `li` a mano en el HTML. Si esto no funcionaba, no tenia sentido seguir.

**Que cambio en el comportamiento:** al abrir la pagina aparecen tres estudiantes (Ana, Luis y Carla) con su promedio y su estado. La pagina no reacciona a nada: para cambiar los datos hay que editar el codigo.

```js
// Version 1: solo DOM. Los datos son fijos y JavaScript dibuja la lista con createElement.

const NOTA_MINIMA = 13; // promedio minimo para aprobar (escala 0 a 20)

const estudiantes = [
  { nombre: "Ana", notas: [15, 14, 17] },
  { nombre: "Luis", notas: [10, 12, 9] },
  { nombre: "Carla", notas: [18, 16] }
];

const titulo = document.querySelector("#titulo");
const lista = document.querySelector("#lista");

titulo.style.color = "navy";

estudiantes.forEach((est) => {
  // promedio calculado a mano con un ciclo
  let suma = 0;
  est.notas.forEach((n) => {
    suma = suma + n;
  });
  const promedio = suma / est.notas.length;
  const aprobado = promedio >= NOTA_MINIMA;

  const li = document.createElement("li");

  const info = document.createElement("span");
  info.classList.add("info");
  info.textContent =
    est.nombre + " | notas: " + est.notas.join(", ") + " | promedio: " + promedio.toFixed(2);
  li.appendChild(info);

  const estado = document.createElement("span");
  estado.textContent = aprobado ? "Aprobado" : "Desaprobado";
  estado.classList.add(aprobado ? "aprobado" : "desaprobado");
  li.appendChild(estado);

  lista.appendChild(li);
});
```

## Version 2: con eventos

**Que agregue:** un formulario para agregar notas (evento `submit`), un campo de busqueda (evento `input`) y un boton **Borrar** en cada fila (evento `click`). Agregue `preventDefault()` para que el formulario no recargue la pagina, y la validacion del nombre y de la nota con un mensaje visible en la pagina (`#mensaje`), sin `alert`. Los datos pasaron a ser una lista que empieza vacia y se llena con lo que escribe el usuario. Como la lista cambia, cree la funcion `dibujar()` que borra la lista y la vuelve a dibujar.

**Por que:** una pagina que solo muestra datos fijos no sirve como registro. Con los eventos el usuario es quien agrega, filtra y elimina. Revise la nota con `trim()` antes de convertirla porque `Number("")` da `0` y un campo vacio pasaria como un 0 valido.

**Que cambio en el comportamiento:** la pagina empieza vacia y reacciona al usuario sin recargar. Si falta el nombre o la nota esta fuera de 0 a 20, aparece un mensaje en rojo. Si todo esta bien aparece en verde, la fila se agrega y el formulario se limpia. El buscador filtra mientras se escribe y Borrar elimina la fila.

```js
// Version 2: con eventos. El usuario agrega, busca y borra. Los datos son objetos simples.

const NOTA_MINIMA = 13; // promedio minimo para aprobar (escala 0 a 20)

let estudiantes = []; // cada elemento: { nombre: "Ana", notas: [15, 14] }

const formNota = document.querySelector("#formNota");
const inputNombre = document.querySelector("#nombre");
const inputNota = document.querySelector("#nota");
const mensaje = document.querySelector("#mensaje");
const buscador = document.querySelector("#buscador");
const lista = document.querySelector("#lista");
const resumen = document.querySelector("#resumen");

function promedio(notas) {
  let suma = 0;
  notas.forEach((n) => {
    suma = suma + n;
  });
  return suma / notas.length;
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.classList.remove("ok", "error");
  mensaje.classList.add(tipo);
}

function dibujar() {
  lista.textContent = "";

  const clave = buscador.value.trim().toLowerCase();
  const visibles = estudiantes.filter((e) => e.nombre.toLowerCase().includes(clave));

  visibles.forEach((est) => {
    const prom = promedio(est.notas);
    const aprobado = prom >= NOTA_MINIMA;

    const li = document.createElement("li");

    const info = document.createElement("span");
    info.classList.add("info");
    info.textContent =
      est.nombre + " | notas: " + est.notas.join(", ") + " | promedio: " + prom.toFixed(2);
    li.appendChild(info);

    const estado = document.createElement("span");
    estado.textContent = aprobado ? "Aprobado" : "Desaprobado";
    estado.classList.add(aprobado ? "aprobado" : "desaprobado");
    li.appendChild(estado);

    const btnBorrar = document.createElement("button");
    btnBorrar.type = "button";
    btnBorrar.textContent = "Borrar";
    btnBorrar.addEventListener("click", () => {
      estudiantes = estudiantes.filter((e) => e !== est);
      mostrarMensaje(est.nombre + " fue eliminado.", "ok");
      dibujar();
    });
    li.appendChild(btnBorrar);

    lista.appendChild(li);
  });

  if (estudiantes.length === 0) {
    resumen.textContent = "Aun no hay estudiantes registrados.";
  } else if (visibles.length === 0) {
    resumen.textContent = "Ningun estudiante coincide con la busqueda.";
  } else {
    resumen.textContent =
      "Mostrando " + visibles.length + " de " + estudiantes.length + " estudiantes.";
  }
}

formNota.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = inputNombre.value.trim();
  const textoNota = inputNota.value.trim();

  if (nombre === "") {
    mostrarMensaje("Escribe el nombre del estudiante.", "error");
    return;
  }
  if (textoNota === "") {
    mostrarMensaje("Escribe una nota.", "error");
    return;
  }

  const nota = Number(textoNota);
  if (Number.isNaN(nota) || nota < 0 || nota > 20) {
    mostrarMensaje("La nota debe ser un numero entre 0 y 20.", "error");
    return;
  }

  // si el nombre ya existe (sin importar mayusculas), se suma la nota
  const existente = estudiantes.find((e) => e.nombre.toLowerCase() === nombre.toLowerCase());
  if (existente) {
    existente.notas.push(nota);
  } else {
    estudiantes.push({ nombre: nombre, notas: [nota] });
  }

  mostrarMensaje("Nota " + nota + " agregada a " + nombre + ".", "ok");
  formNota.reset();
  dibujar();
});

buscador.addEventListener("input", dibujar);

dibujar();
```

## Version 3: con clases y objetos

**Que agregue:** dos clases. `Estudiante` guarda el nombre y la lista de notas, y sabe calcular su `promedio()` y si esta `aprobado()`. `RegistroNotas` guarda a todos los estudiantes y sabe `agregarNota()`, `buscarExacto()`, `eliminar()` y `filtrar()`. El codigo de los eventos y de `dibujar()` ahora llama a estos metodos en lugar de calcular todo por su cuenta.

**Por que:** en la version 2 el calculo del promedio, la regla de aprobacion y la busqueda del estudiante estaban mezclados con el codigo del DOM. Al moverlos a las clases, cada cosa queda en su lugar y la regla de aprobacion esta en un solo sitio.

**Que cambio en el comportamiento:** la pagina se ve y funciona igual que la version 2. El cambio esta en el codigo: esta mas ordenado y es mas facil de modificar o ampliar.

```js
// Tarea Lab 08: registro de notas (DOM + eventos + objetos)

const NOTA_MINIMA = 13; // promedio minimo para aprobar (escala 0 a 20)

// ---------- Clases ----------
class Estudiante {
  constructor(nombre) {
    this.nombre = nombre;
    this.notas = [];
  }

  agregarNota(nota) {
    this.notas.push(nota);
  }

  promedio() {
    if (this.notas.length === 0) {
      return 0;
    }
    let suma = 0;
    this.notas.forEach((n) => {
      suma = suma + n;
    });
    return suma / this.notas.length;
  }

  aprobado() {
    return this.promedio() >= NOTA_MINIMA;
  }
}

class RegistroNotas {
  constructor() {
    this.estudiantes = [];
  }

  // Busca sin importar mayusculas: "ana" y "Ana" son la misma persona
  buscarExacto(nombre) {
    const clave = nombre.toLowerCase();
    return this.estudiantes.find((e) => e.nombre.toLowerCase() === clave);
  }

  agregarNota(nombre, nota) {
    let estudiante = this.buscarExacto(nombre);
    if (!estudiante) {
      estudiante = new Estudiante(nombre);
      this.estudiantes.push(estudiante);
    }
    estudiante.agregarNota(nota);
  }

  eliminar(estudiante) {
    this.estudiantes = this.estudiantes.filter((e) => e !== estudiante);
  }

  filtrar(texto) {
    const clave = texto.trim().toLowerCase();
    return this.estudiantes.filter((e) =>
      e.nombre.toLowerCase().includes(clave)
    );
  }
}

// ---------- Elementos del DOM ----------
const formNota = document.querySelector("#formNota");
const inputNombre = document.querySelector("#nombre");
const inputNota = document.querySelector("#nota");
const mensaje = document.querySelector("#mensaje");
const buscador = document.querySelector("#buscador");
const lista = document.querySelector("#lista");
const resumen = document.querySelector("#resumen");

const registro = new RegistroNotas();

// ---------- Funciones ----------
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.classList.remove("ok", "error");
  mensaje.classList.add(tipo);
}

function dibujar() {
  lista.textContent = ""; // vacia la lista antes de volver a dibujarla

  const visibles = registro.filtrar(buscador.value);

  visibles.forEach((estudiante) => {
    const li = document.createElement("li");

    const info = document.createElement("span");
    info.classList.add("info");
    // textContent: no ejecuta HTML escrito por el usuario
    info.textContent =
      estudiante.nombre +
      " | notas: " + estudiante.notas.join(", ") +
      " | promedio: " + estudiante.promedio().toFixed(2);
    li.appendChild(info);

    const estado = document.createElement("span");
    estado.textContent = estudiante.aprobado() ? "Aprobado" : "Desaprobado";
    estado.classList.add(estudiante.aprobado() ? "aprobado" : "desaprobado");
    li.appendChild(estado);

    const btnBorrar = document.createElement("button");
    btnBorrar.type = "button";
    btnBorrar.textContent = "Borrar";
    // el evento se registra aqui porque el boton se crea aqui
    btnBorrar.addEventListener("click", () => {
      registro.eliminar(estudiante);
      mostrarMensaje(estudiante.nombre + " fue eliminado.", "ok");
      dibujar();
    });
    li.appendChild(btnBorrar);

    lista.appendChild(li);
  });

  if (registro.estudiantes.length === 0) {
    resumen.textContent = "Aun no hay estudiantes registrados.";
  } else if (visibles.length === 0) {
    resumen.textContent = "Ningun estudiante coincide con la busqueda.";
  } else {
    resumen.textContent =
      "Mostrando " + visibles.length + " de " + registro.estudiantes.length + " estudiantes.";
  }
}

// ---------- Eventos ----------
formNota.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = inputNombre.value.trim();
  const textoNota = inputNota.value.trim();

  if (nombre === "") {
    mostrarMensaje("Escribe el nombre del estudiante.", "error");
    return;
  }

  // Number("") da 0, por eso se revisa primero que el campo no este vacio
  if (textoNota === "") {
    mostrarMensaje("Escribe una nota.", "error");
    return;
  }

  const nota = Number(textoNota);

  if (Number.isNaN(nota) || nota < 0 || nota > 20) {
    mostrarMensaje("La nota debe ser un numero entre 0 y 20.", "error");
    return;
  }

  registro.agregarNota(nombre, nota);
  mostrarMensaje("Nota " + nota + " agregada a " + nombre + ".", "ok");
  formNota.reset();
  dibujar();
});

buscador.addEventListener("input", dibujar);

dibujar();
```

## Donde uso DOM, eventos y objetos

Las lineas corresponden al `app.js` final (version 3).

| Parte | Lineas del codigo final | Para que sirve |
|-------|-------------------------|----------------|
| DOM: seleccion de elementos con `querySelector` | 65 a 71 | Encuentra el formulario, los campos, el mensaje, el buscador, la lista y el resumen |
| DOM: `createElement`, `appendChild`, `classList`, `textContent` | 82 a 126 (`dibujar`) | Crea las filas (`li`, `span`, boton Borrar) y las muestra con su clase de color |
| DOM: mensaje visible | 76 a 80 (`mostrarMensaje`) | Muestra en la pagina el error o la confirmacion, sin `alert` |
| Evento `submit` | 129 a 157 | Valida los datos, agrega la nota y redibuja la lista |
| Evento `click` | dentro de `dibujar`, boton Borrar | Elimina al estudiante de la fila y redibuja |
| Evento `input` | 159 | Filtra la lista mientras el usuario escribe |
| Objeto: clase `Estudiante` | 6 a 30 | Guarda nombre y notas; calcula `promedio()` y `aprobado()` |
| Objeto: clase `RegistroNotas` | 32 a 62 | Guarda los estudiantes; busca, agrega, elimina y filtra |
| Objeto: instancia `registro` | linea 73 (`new RegistroNotas()`) y `new Estudiante` en `agregarNota` | Es el objeto con el que trabaja toda la pagina |

## Pruebas realizadas

| N.° | Accion | Resultado esperado | Resultado obtenido | Cumple |
|-----|--------|--------------------|--------------------|--------|
| 1 | Dejar el nombre vacio y enviar | Mensaje en rojo "Escribe el nombre del estudiante." | Aparecio el mensaje en rojo y no se agrego nada | Si |
| 2 | Nombre "Ana" y nota vacia | Mensaje en rojo "Escribe una nota." (no debe contar como 0) | Aparecio el mensaje en rojo y no se agrego nada | Si |
| 3 | Nombre "Ana" y nota 25 | Mensaje en rojo: la nota debe estar entre 0 y 20 | Aparecio el mensaje en rojo y no se agrego nada | Si |
| 4 | Nombre "Ana" y nota 14 | Mensaje en verde y fila nueva con promedio 14.00 Aprobado | Aparecio la fila "Ana", promedio 14.00, Aprobado | Si |
| 5 | Agregar "ana" con nota 10 despues de "Ana" | Se suma al mismo estudiante: notas 14, 10 y promedio 12.00 Desaprobado | Una sola fila, notas 14, 10, promedio 12.00, Desaprobado | Si |
| 6 | Escribir "lu" en el buscador con Ana y Luis registrados | Solo se muestra Luis | Solo aparecio la fila de Luis | Si |
| 7 | Pulsar Borrar en una fila | La fila desaparece y aparece el mensaje de eliminado | La fila desaparecio y salio el mensaje en verde | Si |
| 8 | Escribir `<b>x</b>` como nombre con nota 20 | El nombre se ve como texto, sin negrita | Se vio el texto `<b>x</b>` tal cual | Si |

## Por que disene asi mi clase

Disene `Estudiante` con los atributos `nombre` y `notas` porque son los dos datos que realmente definen a un estudiante en mi registro, y guarde las notas como una lista y no como un solo numero para poder agregar varias a la misma persona y calcular el promedio. Sus metodos `promedio()` y `aprobado()` estan dentro de la clase porque son lo que un estudiante sabe hacer con sus propios datos, y asi la regla de aprobacion (`NOTA_MINIMA`) queda en un solo sitio y no repetida en el codigo de la pagina. Cree `RegistroNotas` aparte, con el atributo `estudiantes` y los metodos `agregarNota()`, `buscarExacto()`, `eliminar()` y `filtrar()`, porque administrar el conjunto (agregar sin duplicar nombres, borrar y buscar) es otra responsabilidad distinta de la de un solo estudiante. Con esta separacion el codigo del DOM solo se encarga de mostrar y de escuchar eventos, y no necesita saber como se calculan los promedios.

## Limitaciones

La solucion vuelve a dibujar toda la lista cada vez que algo cambia. Es simple y suficiente para pocos estudiantes, pero con muchos datos seria mejor actualizar solo la fila afectada. Los datos no se guardan al recargar; una mejora seria usar `localStorage`.