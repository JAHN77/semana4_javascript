# 🚀 Mini App CRUD — Juan Andrés Henríquez 🧑‍💻

Aplicación web integral desarrollada con HTML, CSS y JavaScript puro, que integra manipulación del DOM, persistencia con Local Storage y comunicación con una API REST simulada mediante JSON Server.

[![HTML5](https://img.shields.io/badge/HTML5-Structure-orange)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styles-blue)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![JSON Server](https://img.shields.io/badge/JSON_Server-API-lightgrey)](https://github.com/typicode/json-server)
[![Responsive](https://img.shields.io/badge/Responsive-Design-green)]()

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Responsive Design](#-responsive-design)
- [JavaScript Interactivity](#-javascript-interactivity)
- [Fetch API & CRUD](#-fetch-api--crud)
- [Technologies](#-technologies)
- [How to Run](#-how-to-run)
- [Academic Objectives](#-academic-objectives)
- [Author](#-author)

---

## 📖 Project Overview

Este proyecto corresponde a una mini aplicación web CRUD desarrollada como actividad académica del Módulo 3.

El objetivo principal es aplicar:

- Manipulación dinámica del DOM  
- Persistencia de datos con Local Storage  
- Comunicación con servidor mediante Fetch API  
- Validación de datos y manejo de errores  
- Buenas prácticas en JavaScript ES6+  

El sitio incluye:

- Formulario para agregar y editar productos
- Lista dinámica de productos con acciones por ítem
- Persistencia automática entre sesiones
- Sincronización completa con API REST (JSON Server)

---

## ✨ Features

### 🗂️ Gestión de Productos
- Agregar productos con nombre y precio
- Editar productos directamente desde el formulario
- Eliminar productos con actualización inmediata del DOM
- Validación de campos vacíos, precios inválidos y nombres duplicados

### 💾 Persistencia
- Almacenamiento automático en Local Storage
- Recuperación de datos al recargar la página
- Sincronización bidireccional con la API

### 🌐 Fetch API — CRUD completo
- **GET**: obtener productos desde el servidor
- **POST**: crear producto en la API
- **PUT**: actualizar producto existente
- **DELETE**: eliminar producto del servidor

### 🎨 UI/UX
- Diseño limpio con fuente Inter
- Modo edición visual con resaltado en el formulario
- Mensajes de éxito y error en pantalla
- Botones de acción con feedback visual

---

## 📁 Project Structure

    Semana4/
    │
    ├── index.html     
    ├── app.js       
    ├── style.css      
    ├── db.json     
    ├── package.json 
    └── package-lock.json 

---

## 📱 Responsive Design

Se implementaron estilos adaptativos para distintos dispositivos:

### 📱 Mobile (≤480px)
- Contenedor ocupa el 100% de la pantalla
- Sin bordes redondeados para mejor aprovechamiento del espacio

### 🖥️ Desktop
- Contenedor centrado con ancho máximo de 460px
- Padding generoso y tarjetas flotantes con sombra

Buenas prácticas aplicadas:

- Unidades relativas (`rem`, `%`) en tipografía y espaciado
- Layout con Flexbox para formulario y lista
- Botones que se adaptan al espacio disponible con `flex: 1`

---

## ⚡ JavaScript Interactivity

Se implementa interactividad completa mediante:

- Captura de eventos `submit` y `click`
- Creación dinámica de elementos `<li>` con `createElement` y `appendChild`
- Eliminación de nodos con `removeChild`
- Modo edición: carga datos en el formulario al presionar "Editar"
- Mensajes dinámicos de éxito y error con limpieza automática

Archivo principal:

    app.js

Estructuras de datos utilizadas:

- `Array` — almacena la lista de productos
- `Object` — representa cada producto `{ name, price, id }`
- `Set` — controla nombres duplicados en tiempo real

---

## 🌐 Fetch API & CRUD

Todas las operaciones usan `async/await` con manejo de errores mediante `try/catch`:

    // GET — obtener productos
    const response = await fetch(API_URL);

    // POST — crear producto
    await fetch(API_URL, { method: "POST", body: JSON.stringify(product) });

    // PUT — actualizar producto
    await fetch(`${API_URL}/${id}`, { method: "PUT", body: JSON.stringify(product) });

    // DELETE — eliminar producto
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });

La API corre localmente con JSON Server en:

    http://localhost:3000/products

---

## 🛠️ Technologies

| Categoría    | Tecnología              |
|--------------|-------------------------|
| Estructura   | HTML5                   |
| Estilos      | CSS3 + Flexbox          |
| Lógica       | JavaScript ES6+         |
| API simulada | JSON Server             |
| Persistencia | Local Storage           |
| Tipografía   | Inter (Google Fonts)    |

---

## 🚀 How to Run

1. Clonar repositorio:

       git clone https://github.com/tu-usuario/tu-repo.git

2. Instalar dependencias:

       npm install

3. Iniciar JSON Server:

       npm start

4. Abrir en el navegador:

       index.html

> La API quedará disponible en `http://localhost:3000/products`

---

## 🎯 Academic Objectives

Este proyecto cumple con:

✔ JavaScript moderno ES6+ (`let`, `const`, arrow functions, `async/await`)  
✔ Manipulación del DOM (`createElement`, `appendChild`, `removeChild`)  
✔ Estructuras de datos (`Array`, `Object`, `Set`)  
✔ Persistencia con Local Storage (`setItem`, `getItem`)  
✔ CRUD completo con Fetch API  
✔ Validación de entrada y manejo de errores  
✔ Código comentado y organizado  

---

## 👨‍💻 Author

**Juan Andrés Henríquez**  
Developer Riwi  
Clan Cortissoz  

---

💡 *"Una buena app no solo funciona — también persiste, valida y comunica."*
