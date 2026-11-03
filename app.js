console.log("PRUEBA INICIAL DE STOCKCONTROL");

// ELEMENTOS DE LA

const botonesMenu = document.querySelectorAll(".nav-button");
const botonMenu = document.getElementById("menuToggle");
const barraLateral = document.getElementById("sidebar");
const mensaje = document.getElementById("toast");
const menuOverlay = document.getElementById("menuOverlay");
const botonCerrarMenu = document.getElementById("closeMenu");

const botonNuevo = document.getElementById("newProduct");
const ventanaProducto = document.getElementById("productModal");
const formulario = document.getElementById("productForm");

const botonCerrar = document.getElementById("closeModal");
const botonCancelar = document.getElementById("cancelModal");

const tablaProductos = document.getElementById("productTableBody");
const buscador = document.getElementById("searchProduct");

// ELEMENTOS DEL MODULO DE VENTAS

const formularioVenta = document.getElementById("salesForm");
const selectorProducto = document.getElementById("saleProduct");
const cantidadVenta = document.getElementById("saleQuantity");
const totalVenta = document.getElementById("saleTotal");

// ELEMENTOS DEL HISTORIAL

const historialVentas = document.getElementById("salesHistoryBody");
const ventasDelDia = document.getElementById("dailySales");

// ELEMENTOS PARA RESPALDOS

const botonExportar = document.getElementById("exportProducts");
const botonImportar = document.getElementById("importProducts");
const archivoImportar = document.getElementById("importFile");

// ESTADISTICAS

const totalProductos = document.getElementById("totalProducts");
const productosStockBajo = document.getElementById("lowStockProducts");
const totalUnidades = document.getElementById("totalUnits");

// ELEMENTOS DE CATEGORIAS

const formularioCategoria = document.getElementById("categoryForm");
const nombreCategoria = document.getElementById("categoryName");
const tablaCategorias = document.getElementById("categoriesTableBody");

// ELEMENTOS DE ALERTAS

const contenedorAlertas = document.getElementById("inventoryAlerts");

// ELEMENTOS DE REPORTES

const ingresosTotales = document.getElementById("totalRevenue");
const totalOperaciones = document.getElementById("totalTransactions");
const unidadesVendidas = document.getElementById("totalUnitsSold");
const promedioVenta = document.getElementById("averageSale");
const tablaProductosVendidos = document.getElementById("topProductsBody");

// ELEMENTOS DE CLIENTES

const formularioClientes = document.getElementById("clientForm");
const nombreCliente = document.getElementById("clientName");
const telefonoCliente = document.getElementById("clientPhone");
const tablaClientes = document.getElementById("clientsTableBody");

// CATEGORIAS INICIALES

const categoriasIniciales = [
    "Accesorios",
    "Almacenamiento",
    "Electrónica",
    "Computadoras"
];

// CARGAR CATEGORIAS GUARDADAS

let categoriasGuardadas = localStorage.getItem("stockControlCategorias");

let categorias = categoriasGuardadas
    ? JSON.parse(categoriasGuardadas)
    : categoriasIniciales;

// GUARDAR CATEGORIAS

function guardarCategorias() {

    localStorage.setItem(
        "stockControlCategorias",
        JSON.stringify(categorias)
    );

}

guardarCategorias();

// MOSTRAR CATEGORIAS

function mostrarCategorias() {

    tablaCategorias.innerHTML = "";

    categorias.forEach(function(categoria, indice) {

        const fila = document.createElement("tr");

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = categoria;

        const celdaAcciones = document.createElement("td");

        const botonEliminar = document.createElement("button");

        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "action-button delete-button";
        botonEliminar.dataset.index = indice;

        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaNombre);
        fila.appendChild(celdaAcciones);

        tablaCategorias.appendChild(fila);

    });

}

// REGISTRAR CATEGORIAS

formularioCategoria.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const nombre = nombreCategoria.value.trim();

    if (nombre === "") {
        mostrarMensaje("Escribe un nombre de categoría.");
        return;
    }

    const existe = categorias.some(function(categoria) {

        return categoria.toLowerCase() === nombre.toLowerCase();

    });

    if (existe) {
        mostrarMensaje("Esta categoría ya existe.");
        return;
    }

    categorias.push(nombre);

    guardarCategorias();
    mostrarCategorias();
    actualizarCategoriasFormulario();

    formularioCategoria.reset();

    mostrarMensaje("Categoría agregada correctamente.");

});

// ELIMINAR CATEGORIAS

tablaCategorias.addEventListener("click", function(evento) {

    const boton = evento.target.closest("button");

    if (!boton) {
        return;
    }

    const indice = Number(boton.dataset.index);

    const categoria = categorias[indice];

    const estaEnUso = productos.some(function(producto) {

        return producto.categoria === categoria;

    });

    if (estaEnUso) {

        mostrarMensaje("No puedes eliminar una categoría que tiene productos.");

        return;
    }

    const confirmar = confirm(
        "¿Deseas eliminar esta categoría?"
    );

    if (confirmar) {

        categorias.splice(indice, 1);

        guardarCategorias();
        mostrarCategorias();
        actualizarCategoriasFormulario();

        mostrarMensaje("Categoría eliminada correctamente.");

    }

});

// ACTUALIZAR CATEGORIAS DEL FORMULARIO

function actualizarCategoriasFormulario() {

    const selector = document.getElementById("productCategory");

    const categoriaActual = selector.value;

    selector.innerHTML =
        '<option value="">Selecciona una categoría</option>';

    categorias.forEach(function(categoria) {

        const opcion = document.createElement("option");

        opcion.value = categoria;
        opcion.textContent = categoria;

        selector.appendChild(opcion);

    });

    if (categorias.includes(categoriaActual)) {
        selector.value = categoriaActual;
    }

}

// PRODUCTOS DE EJEMPLO

const productosIniciales = [
    {
        nombre: "Teclado mecánico",
        categoria: "Accesorios",
        precio: 650,
        cantidad: 12
    },
    {
        nombre: "Mouse inalámbrico",
        categoria: "Accesorios",
        precio: 250,
        cantidad: 4
    },
    {
        nombre: "Memoria USB 64 GB",
        categoria: "Almacenamiento",
        precio: 150,
        cantidad: 25
    },
    {
        nombre: "Disco SSD 500 GB",
        categoria: "Almacenamiento",
        precio: 850,
        cantidad: 3
    }
];

// CARGAR PRODUCTOS GUARDADOS

let productosGuardados = localStorage.getItem("stockControlProductos");

let productos = productosGuardados
    ? JSON.parse(productosGuardados)
    : productosIniciales;

// CARGAR HISTORIAL DE VENTAS

let ventasGuardadas = localStorage.getItem("stockControlVentas");

let ventas = ventasGuardadas
    ? JSON.parse(ventasGuardadas)
    : [];

// CARGAR CLIENTES GUARDADOS

let clientesGuardados = localStorage.getItem("stockControlClientes");

let clientes = clientesGuardados
    ? JSON.parse(clientesGuardados)
    : [];

// VARIABLE PARA SABER SI EDITAMOS UN PRODUCTO

let indiceEdicion = null;

// GUARDAR PRODUCTOS EN EL NAVEGADOR

function guardarProductos() {
    localStorage.setItem(
        "stockControlProductos",
        JSON.stringify(productos)
    );
}

// GUARDAR HISTORIAL DE VENTAS

function guardarVentas() {

    localStorage.setItem(
        "stockControlVentas",
        JSON.stringify(ventas)
    );

}

// GUARDAR CLIENTES

function guardarClientes() {

    localStorage.setItem(
        "stockControlClientes",
        JSON.stringify(clientes)
    );

}

// ACTUALIZAR VENTAS DEL DIA

function actualizarVentasDelDia() {

    const hoy = new Date();

    const total = ventas.reduce(function(acumulado, venta) {

        const fechaVenta = new Date(venta.fecha);

        const esHoy =
            fechaVenta.getDate() === hoy.getDate() &&
            fechaVenta.getMonth() === hoy.getMonth() &&
            fechaVenta.getFullYear() === hoy.getFullYear();

        if (esHoy) {
            return acumulado + venta.total;
        }

        return acumulado;

    }, 0);

    ventasDelDia.textContent = formatoPrecio(total);

}

// ACTUALIZAR REPORTES Y ESTADISTICAS

function actualizarReportes() {

    const ingresos = ventas.reduce(function(total, venta) {
        return total + venta.total;
    }, 0);

    const operaciones = ventas.length;

    const unidades = ventas.reduce(function(total, venta) {
        return total + venta.cantidad;
    }, 0);

    const promedio = operaciones > 0
        ? ingresos / operaciones
        : 0;

    ingresosTotales.textContent = formatoPrecio(ingresos);

    totalOperaciones.textContent = operaciones;

    unidadesVendidas.textContent = unidades;

    promedioVenta.textContent = formatoPrecio(promedio);

}

// MOSTRAR PRODUCTOS MAS VENDIDOS

function mostrarProductosMasVendidos() {

    tablaProductosVendidos.innerHTML = "";

    const resumen = {};

    ventas.forEach(function(venta) {

        if (!resumen[venta.producto]) {

            resumen[venta.producto] = {
                cantidad: 0,
                ingresos: 0
            };

        }

        resumen[venta.producto].cantidad += venta.cantidad;

        resumen[venta.producto].ingresos += venta.total;

    });

    const productosOrdenados = Object.entries(resumen);

    productosOrdenados.sort(function(a, b) {
        return b[1].cantidad - a[1].cantidad;
    });

    if (productosOrdenados.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 3;
        celda.textContent = "Todavía no hay datos de ventas.";

        fila.appendChild(celda);
        tablaProductosVendidos.appendChild(fila);

        return;
    }

    productosOrdenados.forEach(function(item) {

        const fila = document.createElement("tr");

        const nombre = document.createElement("td");
        nombre.textContent = item[0];

        const cantidad = document.createElement("td");
        cantidad.textContent = item[1].cantidad;

        const ingresos = document.createElement("td");
        ingresos.textContent = formatoPrecio(item[1].ingresos);

        fila.appendChild(nombre);
        fila.appendChild(cantidad);
        fila.appendChild(ingresos);

        tablaProductosVendidos.appendChild(fila);

    });

}

// MOSTRAR HISTORIAL DE VENTAS

function mostrarHistorialVentas() {

    historialVentas.innerHTML = "";

    if (ventas.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.textContent = "Todavía no hay ventas registradas.";

        fila.appendChild(celda);
        historialVentas.appendChild(fila);

        return;
    }

    ventas.forEach(function(venta) {

        const fila = document.createElement("tr");

        const celdaProducto = document.createElement("td");
        celdaProducto.textContent = venta.producto;

        const celdaCantidad = document.createElement("td");
        celdaCantidad.textContent = venta.cantidad;

        const celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = formatoPrecio(venta.precio);

        const celdaTotal = document.createElement("td");
        celdaTotal.textContent = formatoPrecio(venta.total);

        const celdaFecha = document.createElement("td");

        const fecha = new Date(venta.fecha);

        celdaFecha.textContent = fecha.toLocaleString("es-MX");

        fila.appendChild(celdaProducto);
        fila.appendChild(celdaCantidad);
        fila.appendChild(celdaPrecio);
        fila.appendChild(celdaTotal);
        fila.appendChild(celdaFecha);

        historialVentas.appendChild(fila);

    });

}

// EXPORTAR INVENTARIO

botonExportar.addEventListener("click", function() {

    const datos = JSON.stringify(productos, null, 4);

    const archivo = new Blob(
        [datos],
        { type: "application/json" }
    );

    const enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "respaldo-stockcontrol.json";

    enlace.click();

    URL.revokeObjectURL(enlace.href);

    mostrarMensaje("Inventario exportado correctamente.");
});

// ABRIR SELECTOR DE ARCHIVOS

botonImportar.addEventListener("click", function() {
    archivoImportar.click();
});

// IMPORTAR INVENTARIO

archivoImportar.addEventListener("change", function() {

    const archivo = archivoImportar.files[0];

    if (!archivo) {
        return;
    }

    const lector = new FileReader();

    lector.onload = function(evento) {

        try {

            const datos = JSON.parse(evento.target.result);

            if (!Array.isArray(datos)) {
                throw new Error("Formato incorrecto");
            }

            const datosValidos = datos.every(function(producto) {

                return (
                    producto &&
                    typeof producto.nombre === "string" &&
                    producto.nombre.trim() !== "" &&
                    typeof producto.categoria === "string" &&
                    Number.isFinite(producto.precio) &&
                    producto.precio > 0 &&
                    Number.isInteger(producto.cantidad) &&
                    producto.cantidad >= 0
                );

            });

            if (!datosValidos) {
                throw new Error("Productos inválidos");
            }

            productos = datos;

            guardarProductos();
            mostrarProductos();

            mostrarMensaje("Inventario importado correctamente.");

        } catch (error) {

            mostrarMensaje("El archivo no es válido.");

        }

        archivoImportar.value = "";
    };

    lector.readAsText(archivo);

});

// GUARDAR LOS PRODUCTOS INICIALES O RECUPERADOS

guardarProductos();

// REGISTRAR CLIENTES

formularioClientes.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const nombre = nombreCliente.value.trim();
    const telefono = telefonoCliente.value.trim();

    // VALIDAR NUMERO DE TELEFONO
    const telefonoValido = /^[0-9]{10}$/.test(telefono);

    if (!telefonoValido) {
        mostrarMensaje("El teléfono debe tener exactamente 10 números.");
        return;
    }

    if (nombre === "" || telefono === "") {

        mostrarMensaje("Completa todos los campos.");
        return;

    }

    const nuevoCliente = {
        nombre: nombre,
        telefono: telefono
    };

    clientes.push(nuevoCliente);

    guardarClientes();

    mostrarClientes();

    formularioClientes.reset();

    mostrarMensaje("Cliente registrado correctamente.");

});

// MOSTRAR CLIENTES

function mostrarClientes() {

    tablaClientes.innerHTML = "";

    if (clientes.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 3;
        celda.textContent = "Todavía no hay clientes registrados.";

        fila.appendChild(celda);
        tablaClientes.appendChild(fila);

        return;
    }

    clientes.forEach(function(cliente, indice) {

        const fila = document.createElement("tr");

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = cliente.nombre;

        const celdaTelefono = document.createElement("td");
        celdaTelefono.textContent = cliente.telefono;

        const celdaAcciones = document.createElement("td");

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "action-button edit-button";
        botonEditar.dataset.index = indice;
        botonEditar.dataset.action = "edit";
        botonEditar.type = "button";

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "action-button delete-button";
        botonEliminar.dataset.index = indice;
        botonEliminar.dataset.action = "delete";
        botonEliminar.type = "button";

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaNombre);
        fila.appendChild(celdaTelefono);
        fila.appendChild(celdaAcciones);

        tablaClientes.appendChild(fila);

    });

}

// EDITAR Y ELIMINAR CLIENTES
tablaClientes.addEventListener("click", function(evento) {
    const boton = evento.target;

    if (boton.dataset.action === "delete") {
        const indice = Number(boton.dataset.index);

        clientes.splice(indice, 1);

        guardarClientes();
        mostrarClientes();

        mostrarMensaje("Cliente eliminado correctamente.");
    }

    if (boton.dataset.action === "edit") {
    const indice = Number(boton.dataset.index);

    const cliente = clientes[indice];

    const nuevoNombre = prompt("Escribe el nuevo nombre:", cliente.nombre);

    if (nuevoNombre === null || nuevoNombre.trim() === "") {
        return;
    }

    const nuevoTelefono = prompt("Escribe el nuevo teléfono:", cliente.telefono);

    if (nuevoTelefono === null || nuevoTelefono.trim() === "") {
        return;
    }

    cliente.nombre = nuevoNombre.trim();
    cliente.telefono = nuevoTelefono.trim();

    guardarClientes();
    mostrarClientes();

    mostrarMensaje("Cliente actualizado correctamente.");
    }
});

// MOSTRAR MENSAJES

function mostrarMensaje(texto) {
    mensaje.textContent = texto;
    mensaje.style.display = "block";

    setTimeout(function() {
        mensaje.style.display = "none";
    }, 2500);
}

// FORMATO DE PRECIOS

function formatoPrecio(precio) {
    return precio.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

// ACTUALIZAR ESTADISTICAS

function actualizarEstadisticas() {
    const cantidadProductos = productos.length;

    const cantidadStockBajo = productos.filter(function(producto) {
        return producto.cantidad > 0 && producto.cantidad <= 5;
    }).length;

    const unidades = productos.reduce(function(total, producto) {
        return total + producto.cantidad;
    }, 0);

    totalProductos.textContent = cantidadProductos;
    productosStockBajo.textContent = cantidadStockBajo;
    totalUnidades.textContent = unidades;
}

// MOSTRAR PRODUCTOS

function mostrarProductos() {
    tablaProductos.innerHTML = "";

    const busqueda = buscador.value.toLowerCase().trim();

    productos.forEach(function(producto, indice) {

        if (!producto.nombre.toLowerCase().includes(busqueda)) {
            return;
        }

        let estado = "";
        let claseEstado = "";

        if (producto.cantidad === 0) {
            estado = "Agotado";
            claseEstado = "stock-empty";
        } else if (producto.cantidad <= 5) {
            estado = "Stock bajo";
            claseEstado = "stock-low";
        } else {
            estado = "Disponible";
            claseEstado = "stock-ok";
        }

        const fila = document.createElement("tr");

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = producto.nombre;

        const celdaCategoria = document.createElement("td");
        celdaCategoria.textContent = producto.categoria;

        const celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = formatoPrecio(producto.precio);

        const celdaCantidad = document.createElement("td");
        celdaCantidad.textContent = producto.cantidad;

        const celdaEstado = document.createElement("td");

        const etiqueta = document.createElement("span");
        etiqueta.className = "stock-status " + claseEstado;
        etiqueta.textContent = estado;

        celdaEstado.appendChild(etiqueta);

        const celdaAcciones = document.createElement("td");

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "action-button edit-button";
        botonEditar.dataset.index = indice;
        botonEditar.dataset.action = "edit";

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "action-button delete-button";
        botonEliminar.dataset.index = indice;
        botonEliminar.dataset.action = "delete";

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaNombre);
        fila.appendChild(celdaCategoria);
        fila.appendChild(celdaPrecio);
        fila.appendChild(celdaCantidad);
        fila.appendChild(celdaEstado);
        fila.appendChild(celdaAcciones);

        tablaProductos.appendChild(fila);
    });

    actualizarEstadisticas();
    mostrarAlertasInventario();
}

// MOSTRAR ALERTAS DE INVENTARIO

function mostrarAlertasInventario() {

    contenedorAlertas.innerHTML = "";

    const productosAgotados = productos.filter(function(producto) {
        return producto.cantidad === 0;
    });

    const productosStockBajo = productos.filter(function(producto) {
        return producto.cantidad > 0 && producto.cantidad <= 5;
    });

    if (
        productosAgotados.length === 0 &&
        productosStockBajo.length === 0
    ) {

        const mensaje = document.createElement("div");

        mensaje.className = "inventory-empty-message";
        mensaje.textContent = "Todos los productos tienen existencias suficientes.";

        contenedorAlertas.appendChild(mensaje);

        return;
    }

    productos.forEach(function(producto) {

        if (producto.cantidad === 0) {

            const alerta = document.createElement("div");

            alerta.className = "inventory-alert-item alert-empty";

            const nombre = document.createElement("strong");
            nombre.textContent = producto.nombre;

            const estado = document.createElement("span");
            estado.textContent = "Producto agotado";

            alerta.appendChild(nombre);
            alerta.appendChild(estado);

            contenedorAlertas.appendChild(alerta);

        } else if (producto.cantidad <= 5) {

            const alerta = document.createElement("div");

            alerta.className = "inventory-alert-item alert-low";

            const nombre = document.createElement("strong");
            nombre.textContent = producto.nombre;

            const estado = document.createElement("span");
            estado.textContent =
                "Stock bajo: " + producto.cantidad + " unidades";

            alerta.appendChild(nombre);
            alerta.appendChild(estado);

            contenedorAlertas.appendChild(alerta);

        }

    });

}

// ACTUALIZAR SELECTOR DE PRODUCTOS

function actualizarSelectorVentas() {

    console.log("Productos disponibles:", productos);
    console.log("Selector de ventas:", selectorProducto);

    selectorProducto.innerHTML =
        '<option value="">Selecciona un producto</option>';

    productos.forEach(function(producto, indice) {

        if (producto.cantidad > 0) {

            const opcion = document.createElement("option");

            opcion.value = indice;
            opcion.textContent =
                producto.nombre + " - " +
                formatoPrecio(producto.precio) +
                " (Stock: " + producto.cantidad + ")";

            selectorProducto.appendChild(opcion);
        }

    });

}

// CALCULAR TOTAL DE VENTA

function calcularTotalVenta() {

    const indice = selectorProducto.value;
    const cantidad = Number(cantidadVenta.value);

    if (indice === "" || !Number.isInteger(cantidad) || cantidad <= 0) {

        totalVenta.textContent = formatoPrecio(0);
        return;
    }

    const producto = productos[Number(indice)];

    const total = producto.precio * cantidad;

    totalVenta.textContent = formatoPrecio(total);

}

// ACTUALIZAR TOTAL AUTOMATICAMENTE

selectorProducto.addEventListener("change", calcularTotalVenta);

cantidadVenta.addEventListener("input", calcularTotalVenta);

// CONFIRMAR VENTA

formularioVenta.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const indice = Number(selectorProducto.value);
    const cantidad = Number(cantidadVenta.value);

    if (
        selectorProducto.value === "" ||
        !Number.isInteger(cantidad) ||
        cantidad <= 0
    ) {
        mostrarMensaje("Selecciona un producto y una cantidad válida.");
        return;
    }

    const producto = productos[indice];

    if (!producto || cantidad > producto.cantidad) {

        mostrarMensaje("No hay suficientes existencias.");
        return;
    }

    const total = producto.precio * cantidad;

        // REGISTRAR INFORMACION DE LA VENTA

        const nuevaVenta = {
            producto: producto.nombre,
            cantidad: cantidad,
            precio: producto.precio,
            total: total,
            fecha: new Date().toISOString()
        };

        // AGREGAR VENTA AL HISTORIAL

        ventas.unshift(nuevaVenta);

        // DESCONTAR EXISTENCIAS

        producto.cantidad -= cantidad;

        // GUARDAR INFORMACION

        guardarProductos();
        guardarVentas();

        // ACTUALIZAR PANTALLA

        mostrarProductos();
        actualizarSelectorVentas();
        mostrarHistorialVentas();
        actualizarVentasDelDia();
        actualizarReportes();
        mostrarProductosMasVendidos();
        actualizarReportes();
        mostrarProductosMasVendidos();

    formularioVenta.reset();

    cantidadVenta.value = 1;
    totalVenta.textContent = formatoPrecio(0);

    mostrarMensaje(
        "Venta realizada. Total: " + formatoPrecio(total)
    );

});

// ABRIR FORMULARIO PARA NUEVO PRODUCTO

botonNuevo.addEventListener("click", function() {
    indiceEdicion = null;
    formulario.reset();

    document.querySelector("#productModal h2").textContent =
        "Registrar producto";

    document.querySelector("#productForm button[type='submit']").textContent =
        "Guardar producto";

    ventanaProducto.hidden = false;
});

// CERRAR FORMULARIO

function cerrarFormulario() {
    ventanaProducto.hidden = true;
    formulario.reset();
    indiceEdicion = null;
}

// CERRAR MODAL AL TOCAR FUERA

ventanaProducto.addEventListener("click", function(evento) {

    if (evento.target === ventanaProducto) {
        cerrarFormulario();
    }

});

botonCerrar.addEventListener("click", cerrarFormulario);
botonCancelar.addEventListener("click", cerrarFormulario);

// GUARDAR O EDITAR PRODUCTO

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("productName").value.trim();
    const categoria = document.getElementById("productCategory").value;
    const precio = Number(document.getElementById("productPrice").value);
    const cantidad = Number(document.getElementById("productQuantity").value);

    if (
        nombre === "" ||
        categoria === "" ||
        !Number.isFinite(precio) ||
        precio <= 0 ||
        !Number.isInteger(cantidad) ||
        cantidad < 0
    ) {
        mostrarMensaje("Revisa los datos del producto.");
        return;
    }

    const producto = {
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        cantidad: cantidad
    };

    if (indiceEdicion === null) {
        productos.push(producto);
        mostrarMensaje("Producto registrado correctamente.");
    } else {
        productos[indiceEdicion] = producto;
        mostrarMensaje("Producto actualizado correctamente.");
    }

    guardarProductos();
    mostrarProductos();
    actualizarSelectorVentas();
    cerrarFormulario();
});

// BUSCAR PRODUCTOS

buscador.addEventListener("input", function() {
    mostrarProductos();
});

// EDITAR Y ELIMINAR PRODUCTOS

tablaProductos.addEventListener("click", function(evento) {

    const boton = evento.target.closest("button");

    if (!boton) {
        return;
    }

    const indice = Number(boton.dataset.index);
    const accion = boton.dataset.action;

    if (accion === "edit") {

        const producto = productos[indice];

        indiceEdicion = indice;

        document.getElementById("productName").value = producto.nombre;
        document.getElementById("productCategory").value = producto.categoria;
        document.getElementById("productPrice").value = producto.precio;
        document.getElementById("productQuantity").value = producto.cantidad;

        document.querySelector("#productModal h2").textContent =
            "Editar producto";

        document.querySelector("#productForm button[type='submit']").textContent =
            "Guardar cambios";

        ventanaProducto.hidden = false;
    }

    if (accion === "delete") {

        const confirmar = confirm(
            "¿Estás seguro de que deseas eliminar este producto?"
        );

        if (confirmar) {
            productos.splice(indice, 1);

            guardarProductos();

            mostrarProductos();
            mostrarMensaje("Producto eliminado correctamente.");
        }
    }
});

// NAVEGACION DEL MENU

botonesMenu.forEach(function(boton) {
    boton.addEventListener("click", function() {

        botonesMenu.forEach(function(elemento) {
            elemento.classList.remove("active");
        });

        boton.classList.add("active");

        const seccion = boton.dataset.page;

        if (seccion === "inicio") {
            mostrarMensaje("Estás en el panel principal.");
        } else {
            mostrarMensaje("La sección estará disponible en próximas clases.");
        }

        barraLateral.classList.remove("show");
        menuOverlay.classList.remove("show");
    });
});

// ABRIR MENU

botonMenu.addEventListener("click", function() {
    barraLateral.classList.toggle("show");
    menuOverlay.classList.toggle("show");
});

// CERRAR MENU CON LA X

botonCerrarMenu.addEventListener("click", function() {
    barraLateral.classList.remove("show");
    menuOverlay.classList.remove("show");
});

// CERRAR MENU AL TOCAR EL FONDO

menuOverlay.addEventListener("click", function() {
    barraLateral.classList.remove("show");
    menuOverlay.classList.remove("show");
});

// INICIALIZAR APLICACION
mostrarProductos();
actualizarSelectorVentas();
mostrarHistorialVentas();
actualizarVentasDelDia();
mostrarCategorias();
actualizarCategoriasFormulario();
actualizarReportes();
mostrarProductosMasVendidos();
mostrarClientes();

// REGISTRAR SERVICE WORKER

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function() {

        navigator.serviceWorker.register("./service-worker.js")

            .then(function(registro) {
                console.log("StockControl: Service Worker registrado correctamente.");
            })

            .catch(function(error) {
                console.error("Error al registrar Service Worker:", error);
            });

    });

}

console.log("StockControl: JavaScript funcionando correctamente");