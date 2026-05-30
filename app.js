// ======================================
// REFERENCIAS DEL DOM
// ======================================

const productForm = document.getElementById("productForm");

const productList = document.getElementById("productList");

const message = document.getElementById("message");

const syncButton = document.getElementById("syncButton");

const submitBtn = document.getElementById("submitBtn");

const cancelBtn = document.getElementById("cancelBtn");


// ======================================
// VARIABLES GLOBALES
// ======================================

// Arreglo principal
let products = [];

// Set para controlar nombres duplicados
const productNames = new Set();

// Índice del producto que se está editando (null = modo agregar)
let editingIndex = null;

// URL de JSON Server
const API_URL = "http://localhost:3000/products";


// ======================================
// CARGAR DATOS AL INICIAR
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  // Obtener datos del Local Storage
  const storedProducts = localStorage.getItem("products");

  // Validar existencia
  if (storedProducts) {

    products = JSON.parse(storedProducts);

    products.forEach(p => productNames.add(p.name.toLowerCase()));

    renderProducts();

  }

});


// ======================================
// GUARDAR EN LOCAL STORAGE
// ======================================

function saveToLocalStorage() {

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

}


// ======================================
// MOSTRAR MENSAJES DINÁMICOS
// ======================================

function showMessage(text, type) {

  message.textContent = text;

  if (type === "success") {

    message.style.color = "green";

  } else {

    message.style.color = "red";

  }

  // Limpiar mensaje automáticamente
  setTimeout(() => {

    message.textContent = "";

  }, 3000);

}


// ======================================
// RENDERIZAR PRODUCTOS EN EL DOM
// ======================================

function renderProducts() {

  // Limpiar lista
  productList.innerHTML = "";

  // Recorrer arreglo
  products.forEach((product, index) => {

    // Crear elemento li
    const li = document.createElement("li");

    // Span para el texto (permite truncar con CSS)
    const span = document.createElement("span");
    span.innerHTML = `<strong>${product.name}</strong><span class="price">$${product.price.toLocaleString("es-CO")}</span>`;
    li.appendChild(span);

    // ==================================
    // BOTÓN EDITAR
    // ==================================

    const editButton = document.createElement("button");

    editButton.textContent = "Editar";

    editButton.classList.add("edit-btn");

    editButton.addEventListener("click", () => {

      editProduct(index);

    });

    // ==================================
    // BOTÓN ELIMINAR
    // ==================================

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Eliminar";

    deleteButton.classList.add("delete-btn");

    deleteButton.addEventListener("click", () => {

      deleteProduct(index);

    });

    // Agregar botones
    li.appendChild(editButton);

    li.appendChild(deleteButton);

    // Agregar li a la lista
    productList.appendChild(li);

  });

}


// ======================================
// AGREGAR PRODUCTOS
// ======================================

productForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  // Capturar valores
  const name = document
    .getElementById("name")
    .value
    .trim();

  const price = document
    .getElementById("price")
    .value
    .trim();

  // ==================================
  // VALIDACIONES COMUNES
  // ==================================

  if (name === "" || price === "") {

    showMessage(
      "Todos los campos son obligatorios",
      "error"
    );

    return;
  }

  if (price <= 0) {

    showMessage(
      "El precio debe ser mayor a 0",
      "error"
    );

    return;
  }

  // ==================================
  // MODO ACTUALIZAR
  // ==================================

  if (editingIndex !== null) {

    const product = products[editingIndex];

    // Validar duplicado solo si el nombre cambió
    if (
      name.toLowerCase() !== product.name.toLowerCase() &&
      productNames.has(name.toLowerCase())
    ) {

      showMessage(
        "Ya existe un producto con ese nombre",
        "error"
      );

      return;
    }

    const updatedProduct = {
      ...product,
      name,
      price: Number(price)
    };

    // Actualizar Set
    productNames.delete(product.name.toLowerCase());
    productNames.add(name.toLowerCase());

    // Actualizar arreglo
    products[editingIndex] = updatedProduct;

    // Guardar Local Storage
    saveToLocalStorage();

    // Actualizar DOM
    renderProducts();

    // Actualizar API
    if (product.id) {

      await updateProductAPI(product.id, updatedProduct);

    }

    showMessage("Producto actualizado correctamente", "success");

    // Salir del modo edición
    resetForm();

    return;
  }

  // ==================================
  // MODO AGREGAR
  // ==================================

  // Validar nombre duplicado con Set
  if (productNames.has(name.toLowerCase())) {

    showMessage(
      "Ya existe un producto con ese nombre",
      "error"
    );

    return;
  }

  const newProduct = {
    name,
    price: Number(price)
  };

  // Registrar nombre en el Set
  productNames.add(name.toLowerCase());

  // Agregar al arreglo
  products.push(newProduct);

  // Guardar Local Storage
  saveToLocalStorage();

  // Actualizar DOM
  renderProducts();

  showMessage("Producto agregado correctamente", "success");

  // Guardar en API (si falla, revertir)
  await createProductAPI(newProduct);

  // Limpiar formulario
  productForm.reset();

});


// ======================================
// ELIMINAR PRODUCTO
// ======================================

async function deleteProduct(index) {

  try {

    const product = products[index];

    // Eliminar de API
    if (product.id) {

      await deleteProductAPI(product.id);

    }

    // Eliminar el <li> directamente del DOM con removeChild
    const listItem = productList.children[index];
    productList.removeChild(listItem);

    // Liberar nombre del Set
    productNames.delete(product.name.toLowerCase());

    // Eliminar del arreglo
    products.splice(index, 1);

    // Actualizar Local Storage
    saveToLocalStorage();

    // Re-renderizar para actualizar índices de los botones restantes
    renderProducts();

    // Mensaje
    showMessage(
      "Producto eliminado",
      "success"
    );

  } catch (error) {

    console.error(error);

    showMessage(
      "Error eliminando producto",
      "error"
    );

  }

}


// ======================================
// EDITAR PRODUCTO 
// ======================================

function editProduct(index) {

  const product = products[index];

  // Cargar datos en los inputs
  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;

  // Activar modo edición
  editingIndex = index;
  submitBtn.textContent = "Actualizar Producto";
  submitBtn.classList.replace("add-btn", "update-btn");
  cancelBtn.style.display = "block";
  productForm.classList.add("editing");

  // Hacer scroll al formulario
  productForm.scrollIntoView({ behavior: "smooth" });

}


// ======================================
// RESETEAR FORMULARIO
// ======================================

function resetForm() {

  productForm.reset();

  editingIndex = null;

  submitBtn.textContent = "Agregar Producto";
  submitBtn.classList.replace("update-btn", "add-btn");
  cancelBtn.style.display = "none";
  productForm.classList.remove("editing");

}


// Botón cancelar
cancelBtn.addEventListener("click", resetForm);


// ======================================
// FETCH API - GET
// ======================================

async function getProductsAPI() {

  try {

    const response = await fetch(API_URL);

    const data = await response.json();

    console.log("GET:", data);

    // Actualizar arreglo
    products = data;

    // Reconstruir el Set con los datos del servidor
    productNames.clear();
    products.forEach(p => productNames.add(p.name.toLowerCase()));

    // Actualizar DOM
    renderProducts();

    // Guardar Local Storage
    saveToLocalStorage();

    showMessage(
      "Productos sincronizados",
      "success"
    );

  } catch (error) {

    console.error("Error GET:", error);

    showMessage(
      "Error obteniendo productos",
      "error"
    );

  }

}


// ======================================
// FETCH API - POST
// ======================================

async function createProductAPI(product) {

  try {

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify(product)

    });

    const data = await response.json();

    console.log("POST:", data);

    // Guardar id generado por la API
    products[products.length - 1].id = data.id;

    // Actualizar Local Storage con el id
    saveToLocalStorage();

  } catch (error) {

    console.error("Error POST:", error);

    // Revertir: quitar el producto del arreglo, Set y Local Storage
    const reverted = products.pop();

    if (reverted) {
      productNames.delete(reverted.name.toLowerCase());
    }

    saveToLocalStorage();

    renderProducts();

    showMessage(
      "No se pudo guardar en el servidor, se revirtió el producto",
      "error"
    );

  }

}


// ======================================
// FETCH API - PUT
// ======================================

async function updateProductAPI(id, updatedProduct) {

  try {

    const response = await fetch(
      `${API_URL}/${id}`,
      {

        method: "PUT",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify(updatedProduct)

      }
    );

    const data = await response.json();

    console.log("PUT:", data);

  } catch (error) {

    console.error("Error PUT:", error);

  }

}


// ======================================
// FETCH API - DELETE
// ======================================

async function deleteProductAPI(id) {

  try {

    const response = await fetch(
      `${API_URL}/${id}`,
      {

        method: "DELETE"

      }
    );

    console.log("DELETE:", response);

  } catch (error) {

    console.error("Error DELETE:", error);

  }

}


// ======================================
// BOTÓN SINCRONIZAR
// ======================================

syncButton.addEventListener("click", () => {

  getProductsAPI();

});