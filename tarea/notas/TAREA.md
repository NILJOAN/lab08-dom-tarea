# Tarea: Mi componente interactivo

## Componente elegido

Elegi un **registro de notas de estudiantes que calcula el promedio**. Se escribe el nombre y una nota entre 0 y 20; si el estudiante ya existe se le agrega la nota, si no se crea. Cada fila muestra sus notas, el promedio y si esta Aprobado (promedio de 13 o mas) o Desaprobado, y tiene un boton para borrarla. Hay un buscador por nombre y un resumen con el promedio del salon.

## Version 1: solo DOM

**Que agregue:** una pagina con una lista vacia y un `app.js` que recorre un arreglo de tres estudiantes escritos a mano, calcula el promedio de cada uno con una funcion y crea con `createElement` un `li` por estudiante. Con `classList` le pone la clase `aprobado` o `desaprobado` segun el promedio.

**Por que:** queria asegurarme primero de que sabia encontrar elementos y dibujar datos en la pagina antes de agregar interaccion.

**Que cambio en el comportamiento:** la lista no esta escrita en el HTML: la crea JavaScript al cargar, con los promedios (Ana 15.33, Luis 11.00, Marta 17.00) y colores segun el estado. Todavia no reacciona a nada: para cambiar un dato hay que editar `app.js`.

```js
// Tarea - Version 1: solo DOM (sin eventos y sin clases)
const titulo = document.querySelector("#titulo");
const lista = document.querySelector("#lista");

titulo.textContent = "Registro de notas";

// Datos fijos escritos a mano
const estudiantes = [
  { nombre: "Ana", notas: [15, 17, 14] },
  { nombre: "Luis", notas: [10, 12, 11] },
  { nombre: "Marta", notas: [18, 16] },
];

function promedio(notas) {
  let suma = 0;
  notas.forEach((n) => {
    suma = suma + n;
  });
  return suma / notas.length;
}

estudiantes.forEach((e) => {
  const prom = promedio(e.notas);

  const li = document.createElement("li");
  li.textContent = e.nombre + " - notas: " + e.notas.join(", ") + " - promedio: " + prom.toFixed(2);

  if (prom >= 13) {
    li.classList.add("aprobado");
  } else {
    li.classList.add("desaprobado");
  }

  lista.appendChild(li);
});
# Tarea: Mi componente interactivo

## Componente elegido

Elegi un **registro de notas de estudiantes que calcula el promedio**. Se escribe el nombre y una nota entre 0 y 20; si el estudiante ya existe se le agrega la nota, si no se crea. Cada fila muestra sus notas, el promedio y si esta Aprobado (promedio de 13 o mas) o Desaprobado, y tiene un boton para borrarla. Hay un buscador por nombre y un resumen con el promedio del salon.

## Version 1: solo DOM

**Que agregue:** una pagina con una lista vacia y un `app.js` que recorre un arreglo de tres estudiantes escritos a mano, calcula el promedio de cada uno con una funcion y crea con `createElement` un `li` por estudiante. Con `classList` le pone la clase `aprobado` o `desaprobado` segun el promedio.

**Por que:** queria asegurarme primero de que sabia encontrar elementos y dibujar datos en la pagina antes de agregar interaccion.

**Que cambio en el comportamiento:** la lista no esta escrita en el HTML: la crea JavaScript al cargar, con los promedios (Ana 15.33, Luis 11.00, Marta 17.00) y colores segun el estado. Todavia no reacciona a nada: para cambiar un dato hay que editar `app.js`.

```js
// Tarea - Version 1: solo DOM (sin eventos y sin clases)
const titulo = document.querySelector("#titulo");
const lista = document.querySelector("#lista");

titulo.textContent = "Registro de notas";

// Datos fijos escritos a mano
const estudiantes = [
  { nombre: "Ana", notas: [15, 17, 14] },
  { nombre: "Luis", notas: [10, 12, 11] },
  { nombre: "Marta", notas: [18, 16] },
];

function promedio(notas) {
  let suma = 0;
  notas.forEach((n) => {
    suma = suma + n;
  });
  return suma / notas.length;
}

estudiantes.forEach((e) => {
  const prom = promedio(e.notas);

  const li = document.createElement("li");
  li.textContent = e.nombre + " - notas: " + e.notas.join(", ") + " - promedio: " + prom.toFixed(2);

  if (prom >= 13) {
    li.classList.add("aprobado");
  } else {
    li.classList.add("desaprobado");
  }

  lista.appendChild(li);
});
```

## Version 2: con eventos

**Que agregue:** un formulario para ingresar nombre y nota (evento `submit`), un buscador (evento `input`) y un boton Borrar en cada fila (evento `click`). Agregue validacion con mensajes dentro de la pagina: nombre de al menos 2 letras y nota entre 0 y 20. Los datos siguen en un arreglo de objetos literales y funciones sueltas. Tambien agregue la funcion `dibujar()`, que vuelve a pintar la lista cada vez que algo cambia.

**Por que:** la tarea pide que la interfaz responda al usuario. Use `preventDefault()` para que el formulario no recargue la pagina y `textContent` para mostrar lo escrito como texto y no como HTML.

**Que cambio en el comportamiento:** ahora la lista empieza vacia y el usuario la llena. Una nota invalida muestra un mensaje en rojo y no se guarda; escribir en el buscador filtra al instante; Borrar elimina la fila y actualiza el promedio del salon.

```js
// Evento submit: agregar nota con validacion
formNota.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = inputNombre.value.trim();
  const nota = Number(inputNota.value);

  if (nombre.length < 2) {
    mostrarMensaje("Error: escribe un nombre de al menos 2 letras.", "error");
    return;
  }
  if (inputNota.value === "" || Number.isNaN(nota) || nota < 0 || nota > 20) {
    mostrarMensaje("Error: la nota debe ser un numero entre 0 y 20.", "error");
    return;
  }

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

// Evento input: filtrar mientras se escribe
buscador.addEventListener("input", dibujar);

dibujar();
```

```js
// Dentro de dibujar(): el boton Borrar de cada fila
      const btnBorrar = document.createElement("button");
      btnBorrar.textContent = "Borrar";
      btnBorrar.addEventListener("click", () => {
        const pos = estudiantes.indexOf(e);
        estudiantes.splice(pos, 1);
        dibujar();
      });
# Tarea: Mi componente interactivo

## Componente elegido

Elegi un **registro de notas de estudiantes que calcula el promedio**. Se escribe el nombre y una nota entre 0 y 20; si el estudiante ya existe se le agrega la nota, si no se crea. Cada fila muestra sus notas, el promedio y si esta Aprobado (promedio de 13 o mas) o Desaprobado, y tiene un boton para borrarla. Hay un buscador por nombre y un resumen con el promedio del salon.

## Version 1: solo DOM

**Que agregue:** una pagina con una lista vacia y un `app.js` que recorre un arreglo de tres estudiantes escritos a mano, calcula el promedio de cada uno con una funcion y crea con `createElement` un `li` por estudiante. Con `classList` le pone la clase `aprobado` o `desaprobado` segun el promedio.

**Por que:** queria asegurarme primero de que sabia encontrar elementos y dibujar datos en la pagina antes de agregar interaccion.

**Que cambio en el comportamiento:** la lista no esta escrita en el HTML: la crea JavaScript al cargar, con los promedios (Ana 15.33, Luis 11.00, Marta 17.00) y colores segun el estado. Todavia no reacciona a nada: para cambiar un dato hay que editar `app.js`.

```js
// Tarea - Version 1: solo DOM (sin eventos y sin clases)
const titulo = document.querySelector("#titulo");
const lista = document.querySelector("#lista");

titulo.textContent = "Registro de notas";

// Datos fijos escritos a mano
const estudiantes = [
  { nombre: "Ana", notas: [15, 17, 14] },
  { nombre: "Luis", notas: [10, 12, 11] },
  { nombre: "Marta", notas: [18, 16] },
];

function promedio(notas) {
  let suma = 0;
  notas.forEach((n) => {
    suma = suma + n;
  });
  return suma / notas.length;
}

estudiantes.forEach((e) => {
  const prom = promedio(e.notas);

  const li = document.createElement("li");
  li.textContent = e.nombre + " - notas: " + e.notas.join(", ") + " - promedio: " + prom.toFixed(2);

  if (prom >= 13) {
    li.classList.add("aprobado");
  } else {
    li.classList.add("desaprobado");
  }

  lista.appendChild(li);
});
```

## Version 2: con eventos

**Que agregue:** un formulario para ingresar nombre y nota (evento `submit`), un buscador (evento `input`) y un boton Borrar en cada fila (evento `click`). Agregue validacion con mensajes dentro de la pagina: nombre de al menos 2 letras y nota entre 0 y 20. Los datos siguen en un arreglo de objetos literales y funciones sueltas. Tambien agregue la funcion `dibujar()`, que vuelve a pintar la lista cada vez que algo cambia.

**Por que:** la tarea pide que la interfaz responda al usuario. Use `preventDefault()` para que el formulario no recargue la pagina y `textContent` para mostrar lo escrito como texto y no como HTML.

**Que cambio en el comportamiento:** ahora la lista empieza vacia y el usuario la llena. Una nota invalida muestra un mensaje en rojo y no se guarda; escribir en el buscador filtra al instante; Borrar elimina la fila y actualiza el promedio del salon.

```js
// Evento submit: agregar nota con validacion
formNota.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = inputNombre.value.trim();
  const nota = Number(inputNota.value);

  if (nombre.length < 2) {
    mostrarMensaje("Error: escribe un nombre de al menos 2 letras.", "error");
    return;
  }
  if (inputNota.value === "" || Number.isNaN(nota) || nota < 0 || nota > 20) {
    mostrarMensaje("Error: la nota debe ser un numero entre 0 y 20.", "error");
    return;
  }

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

// Evento input: filtrar mientras se escribe
buscador.addEventListener("input", dibujar);

dibujar();
```

```js
// Dentro de dibujar(): el boton Borrar de cada fila
      const btnBorrar = document.createElement("button");
      btnBorrar.textContent = "Borrar";
      btnBorrar.addEventListener("click", () => {
        const pos = estudiantes.indexOf(e);
        estudiantes.splice(pos, 1);
        dibujar();
      });
```

## Version 3: con clases y objetos

**Que agregue:** las clases `Estudiante` (atributos `nombre` y `notas`; metodos `agregarNota`, `promedio`, `estado` y `descripcion`) y `RegistroNotas` (atributo `estudiantes`; metodos `buscarPorNombre`, `agregarNota`, `eliminar`, `filtrar` y `promedioGeneral`). Movi a las clases los calculos que en la version 2 eran funciones sueltas.

**Por que:** en la version 2 los datos y las reglas (como el 13 para aprobar) estaban repartidos por todo el archivo. Con clases cada cosa vive donde corresponde y `dibujar()` solo se encarga de mostrar.

**Que cambio en el comportamiento:** para el usuario la pagina se ve y funciona igual; lo que cambio es el codigo: ahora los eventos llaman a metodos como `registro.agregarNota(nombre, nota)` o `registro.eliminar(estudiante)`, y cambiar una regla se hace en un solo lugar.

```js
const NOTA_MINIMA = 13;

class Estudiante {
  constructor(nombre, notas = []) {
    this.nombre = nombre;
    this.notas = notas;
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

  estado() {
    return this.promedio() >= NOTA_MINIMA ? "Aprobado" : "Desaprobado";
  }

  descripcion() {
    return (
      this.nombre + " - notas: " + this.notas.join(", ") +
      " - promedio: " + this.promedio().toFixed(2) +
      " - " + this.estado()
    );
  }
}

class RegistroNotas {
  constructor() {
    this.estudiantes = [];
  }

  buscarPorNombre(nombre) {
    return this.estudiantes.find((e) => e.nombre.toLowerCase() === nombre.toLowerCase());
  }

  agregarNota(nombre, nota) {
    let estudiante = this.buscarPorNombre(nombre);
    if (!estudiante) {
      estudiante = new Estudiante(nombre);
      this.estudiantes.push(estudiante);
    }
    estudiante.agregarNota(nota);
    return estudiante;
  }

  eliminar(estudiante) {
    this.estudiantes = this.estudiantes.filter((e) => e !== estudiante);
  }

  filtrar(texto) {
    const t = texto.trim().toLowerCase();
    return this.estudiantes.filter((e) => e.nombre.toLowerCase().includes(t));
  }

  promedioGeneral() {
    if (this.estudiantes.length === 0) {
      return 0;
    }
    let suma = 0;
    this.estudiantes.forEach((e) => {
      suma = suma + e.promedio();
    });
    return suma / this.estudiantes.length;
  }
}
```

```js
// ---- Eventos ----
formNota.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = inputNombre.value.trim();
  const nota = Number(inputNota.value);

  if (nombre.length < 2) {
    mostrarMensaje("Error: escribe un nombre de al menos 2 letras.", "error");
    return;
  }
  if (inputNota.value === "" || Number.isNaN(nota) || nota < 0 || nota > 20) {
    mostrarMensaje("Error: la nota debe ser un numero entre 0 y 20.", "error");
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

| Parte | Donde esta en `tarea/app.js` (version final) | Para que sirve |
|-------|-----------------------------------------------|----------------|
| DOM | `document.querySelector` (lineas 79 a 85) | Encontrar el formulario, los campos, el buscador, la lista y los mensajes |
| DOM | `createElement` de `li`, `span` y `button` (lineas 98, 101 y 105) | Crear cada fila de estudiante |
| DOM | `replaceChildren()` (linea 95), `textContent` y `classList` (lineas 90, 99 y 103) | Borrar la lista antes de volver a dibujarla, escribir textos y cambiar el color segun el estado |
| Eventos | `formNota.addEventListener("submit", ...)` (linea 127) | Agregar la nota y validar los datos |
| Eventos | `btnBorrar.addEventListener("click", ...)` (linea 107) | Borrar un estudiante |
| Eventos | `buscador.addEventListener("input", dibujar)` (linea 148) | Filtrar mientras se escribe |
| Objetos | `class Estudiante` (linea 4) y `class RegistroNotas` (linea 38) | Guardar los datos y los calculos |
| Objetos | `const registro = new RegistroNotas();` (linea 87) y `registro.agregarNota(...)`, `registro.eliminar(...)`, `registro.filtrar(...)` (lineas 142, 108 y 97) | Usar los objetos desde los eventos y al dibujar |

## Pruebas realizadas

| # | Accion | Resultado esperado | Resultado obtenido | Cumple |
|---|--------|--------------------|--------------------|--------|
| 1 | Agregar nombre "Ana" con nota 15 | Aparece una fila de Ana con promedio 15.00 y estado Aprobado | Fila "Ana - notas: 15 - promedio: 15.00 - Aprobado" y mensaje verde "Nota 15 agregada a Ana." | Si |
| 2 | Agregar nombre "ana" (en minuscula) con nota 11 | No crea otra fila: suma la nota a Ana y el promedio pasa a 13.00 | Una sola fila: "Ana - notas: 15, 11 - promedio: 13.00 - Aprobado" | Si |
| 3 | Agregar "Luis" con nota 10 | Fila de Luis en rojo como Desaprobado y promedio del salon 11.50 | Fila de Luis "Desaprobado" en rojo y resumen "Estudiantes: 2 - Promedio del salon: 11.50" | Si |
| 4 | Agregar "Marta" con nota 25 | Mensaje de error en la pagina y no se agrega nada | "Error: la nota debe ser un numero entre 0 y 20." en rojo; la lista no cambio | Si |
| 5 | Dejar el nombre vacio con nota 12 | Mensaje de error de nombre | "Error: escribe un nombre de al menos 2 letras." y no se agrego nada | Si |
| 6 | Escribir "mar" en el buscador (con Ana, Luis, Marta y Mario) | Solo se ven Marta y Mario | Se muestran solo las filas de Marta y Mario | Si |
| 7 | Pulsar Borrar en la fila de Luis | La fila desaparece y el promedio del salon se actualiza | La fila desaparecio y el resumen paso a "Estudiantes: 3 - Promedio del salon: 15.00" | Si |
| 8 | Escribir `<b>x</b>` como nombre con nota 12 | El texto se muestra tal cual, sin interpretarse como HTML | Se ve `<b>x</b> - notas: 12 - ...` como texto y no aparece ningun elemento `b` | Si |

## Por que disene asi mi clase

Disene `Estudiante` con los atributos `nombre` y `notas` porque son lo unico que necesito guardar: el promedio y el estado no los guardo, los calculo con los metodos `promedio()` y `estado()` cada vez que se piden, asi nunca quedan desactualizados cuando se agrega una nota. El metodo `agregarNota()` es la unica forma de cambiar la lista de notas, y `descripcion()` arma el texto de la fila para que `dibujar()` no tenga que conocer el formato. Cree aparte `RegistroNotas` porque la coleccion de estudiantes tiene sus propias acciones (buscar sin distinguir mayusculas, agregar, eliminar, filtrar y sacar el promedio general) y no pertenecen a un solo estudiante. La nota minima para aprobar (13) la deje en la constante `NOTA_MINIMA` para poder cambiarla en un solo lugar.