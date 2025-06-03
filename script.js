let personas = [];

// Función para normalizar texto (quitar tildes y pasar a minúsculas)
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Leer y cargar el CSV cuando se carga la página
window.addEventListener("DOMContentLoaded", () => {
  fetch("personas.csv")
    .then(response => response.text())
    .then(data => {
      personas = parseCSV(data);
    })
    .catch(error => {
      console.error("Error al cargar el CSV:", error);
    });
});

// Convertir CSV a objetos JavaScript
function parseCSV(data) {
  const lines = data.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
}

// Función de búsqueda
function buscarInformacion() {
  const entrada = document.getElementById("nombreInput").value.trim();
  const nombreIngresado = normalizarTexto(entrada);

  const mensaje = document.getElementById("mensaje");
  const tabla = document.getElementById("tablaInfo");
  const contenedor = document.getElementById("table-container");

  // Limpiar contenido anterior
  mensaje.textContent = "";
  tabla.innerHTML = "";
  contenedor.style.display = "none";

  if (!nombreIngresado) {
    mensaje.textContent = "Por favor, escribe un nombre.";
    return;
  }

  const resultados = personas.filter(p =>
    normalizarTexto(p.nombre).includes(nombreIngresado)
  );

  if (resultados.length === 0) {
    mensaje.textContent = "Trate escribiendo solamente su primer nombre";
    return;
  }

  tabla.innerHTML += `
    <tr>
      <th>Nombre</th>
      <th>Tema</th>
      <th>Mesa</th>
    </tr>
  `;

  resultados.forEach(p => {
    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.tema}</td>
        <td>${p.mesa}</td>
      </tr>
    `;
  });

  document.getElementById("nombreMostrado").textContent = `para "${entrada}"`;
  contenedor.style.display = "block";
}
