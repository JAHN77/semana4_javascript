// ======================================
// REFERENCIAS DEL DOM
// ======================================

const productForm = document.getElementById("productForm");

const productList = document.getElementById("productList");

const message = document.getElementById("message");

const syncButton = document.getElementById("syncButton");


// ======================================
// VARIABLES GLOBALES
// ======================================

// Arreglo principal
let products = [];

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

    li.textContent = `${product.name} - $${product.price}`;

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
  // VALIDACIONES
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
  // CREAR OBJETO
  // ==================================

  const newProduct = {

    name,
    price: Number(price)

  };

  // Agregar al arreglo
  products.push(newProduct);

  // Guardar Local Storage
  saveToLocalStorage();

  // Actualizar DOM
  renderProducts();

  // Mensaje
  showMessage(
    "Producto agregado correctamente",
    "success"
  );

  // Guardar en API
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

    // Eliminar del arreglo
    products.splice(index, 1);

    // Actualizar Local Storage
    saveToLocalStorage();

    // Actualizar DOM
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

async function editProduct(index) {

  try {

    // Producto actual
    const product = products[index];

    // Solicitar nuevos datos
    const newName = prompt(
      "Nuevo nombre:",
      product.name
    );

    const newPrice = prompt(
      "Nuevo precio:",
      product.price
    );

    // ==================================
    // VALIDACIONES
    // ==================================

    if (!newName || !newPrice) {

      showMessage(
        "Datos inválidos",
        "error"
      );

      return;
    }

    if (newPrice <= 0) {

      showMessage(
        "Precio inválido",
        "error"
      );

      return;
    }

    // ==================================
    // OBJETO ACTUALIZADO
    // ==================================

    const updatedProduct = {

      ...product,

      name: newName,

      price: Number(newPrice)

    };

    // Actualizar arreglo
    products[index] = updatedProduct;

    // Guardar Local Storage
    saveToLocalStorage();

    // Actualizar DOM
    renderProducts();

    // Actualizar API
    if (product.id) {

      await updateProductAPI(
        product.id,
        updatedProduct
      );

    }

    // Mensaje
    showMessage(
      "Producto actualizado correctamente",
      "success"
    );

  } catch (error) {

    console.error(error);

    showMessage(
      "Error actualizando producto",
      "error"
    );

  }

}


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

    // Guardar id generado
    products[products.length - 1].id = data.id;

    // Actualizar Local Storage
    saveToLocalStorage();

  } catch (error) {

    console.error("Error POST:", error);

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