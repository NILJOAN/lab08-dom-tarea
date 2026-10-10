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