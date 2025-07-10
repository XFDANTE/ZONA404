
const USERNAME = "ZONA404";
const PASSWORD = "qwerty1234";
const PCs = ["PC 1", "PC 2", "PC 3", "PC 4"];
const HOURLY_RATE = 2000;
let data = { "PC 1": [], "PC 2": [], "PC 3": [], "PC 4": [] };

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === USERNAME && pass === PASSWORD) {
    document.getElementById("login-section").classList.add("d-none");
    document.getElementById("main-section").classList.remove("d-none");
    renderPCs();
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
}

function renderPCs() {
  const container = document.getElementById("pc-sections");
  container.innerHTML = "";
  
  PCs.forEach(pc => {
    const items = data[pc]
      .map((item, index) => `
        <li>
          ${item.name}: $${item.price}
          <button class="btn btn-sm btn-warning" onclick="editItem('${pc}', ${index})">Editar</button>
        </li>
      `)
      .join("");

    const total = data[pc].reduce((sum, item) => sum + item.price, 0);

    container.innerHTML += `
      <div class="col-md-6">
        <div class="card mb-3">
          <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">${pc}</h5>
            <button class="btn btn-info btn-sm" onclick="downloadPCData('${pc}')">Exportar</button>
          </div>
          <div class="card-body">
            <ul class="list-unstyled">${items}</ul>
            <p><strong>Total:</strong> $${total}</p>
            <button class="btn btn-danger btn-sm" onclick="clearPC('${pc}')">Limpiar</button>
          </div>
        </div>
      </div>
    `;
  });
}


function addProduct() {
  const name = document.getElementById("productName").value;
  const price = parseInt(document.getElementById("productPrice").value);
  if (!name || isNaN(price)) return alert("Ingrese nombre y precio del producto.");

  const pc = prompt("¿A qué PC deseas agregar este producto? (1-4)");
  const pcKey = "PC " + pc;
  if (!data[pcKey]) return alert("PC inválida.");

  data[pcKey].push({ name, price });
  saveData();
  renderPCs();
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
}

function editItem(pc, index) {
  const newPrice = prompt("Nuevo precio para " + data[pc][index].name, data[pc][index].price);
  const priceNum = parseInt(newPrice);
  if (!isNaN(priceNum)) {
    data[pc][index].price = priceNum;
    saveData();
    renderPCs();
  }
}

function clearPC(pc) {
  if (confirm("¿Seguro que quieres borrar los datos de " + pc + "?")) {
    data[pc] = [];
    saveData();
    renderPCs();
  }
}

function saveData() {
  localStorage.setItem("zona404_data", JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem("zona404_data");
  if (saved) data = JSON.parse(saved);
}

function downloadPCData(pc) {
  const json = JSON.stringify(data[pc], null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = pc + "_zona404.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

loadData();
