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
const tabla = document.querySelector("#tabla");
const vacio = document.querySelector("#vacio");

const registro = new RegistroNotas();

// ---------- Funciones ----------
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.classList.remove("ok", "error");
  mensaje.classList.add(tipo);
}

function crearCelda(texto) {
  const td = document.createElement("td");
  td.textContent = texto; // textContent: no ejecuta HTML escrito por el usuario
  return td;
}

function dibujar() {
  tabla.textContent = ""; // vacia la tabla antes de volver a dibujarla

  const lista = registro.filtrar(buscador.value);

  lista.forEach((estudiante) => {
    const fila = document.createElement("tr");

    fila.appendChild(crearCelda(estudiante.nombre));
    fila.appendChild(crearCelda(estudiante.notas.join(", ")));
    fila.appendChild(crearCelda(estudiante.promedio().toFixed(2)));

    const estado = crearCelda(estudiante.aprobado() ? "Aprobado" : "Desaprobado");
    estado.classList.add(estudiante.aprobado() ? "aprobado" : "desaprobado");
    fila.appendChild(estado);

    const celdaBoton = document.createElement("td");
    const btnBorrar = document.createElement("button");
    btnBorrar.type = "button";
    btnBorrar.textContent = "Borrar";
    // el evento se registra aqui porque el boton se crea aqui
    btnBorrar.addEventListener("click", () => {
      registro.eliminar(estudiante);
      mostrarMensaje(estudiante.nombre + " fue eliminado.", "ok");
      dibujar();
    });
    celdaBoton.appendChild(btnBorrar);
    fila.appendChild(celdaBoton);

    tabla.appendChild(fila);
  });

  if (registro.estudiantes.length === 0) {
    vacio.textContent = "Aun no hay estudiantes registrados.";
  } else if (lista.length === 0) {
    vacio.textContent = "Ningun estudiante coincide con la busqueda.";
  } else {
    vacio.textContent = "";
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