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