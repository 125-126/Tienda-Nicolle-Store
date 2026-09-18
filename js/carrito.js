/* =========================================================
   NICOLLE STORE
   SISTEMA DE CARRITO
========================================================= */

const CLAVE_CARRITO = "nicolleStoreCarrito";


/* =========================================================
   OBTENER CARRITO
========================================================= */

function obtenerCarrito() {

    try {

        const carritoGuardado =
            localStorage.getItem(CLAVE_CARRITO);

        if (!carritoGuardado) {
            return [];
        }

        const carrito = JSON.parse(carritoGuardado);

        return Array.isArray(carrito) ? carrito : [];

    } catch (error) {

        console.error(
            "Error al leer el carrito:",
            error
        );

        return [];

    }

}


/* =========================================================
   GUARDAR CARRITO
========================================================= */

function guardarCarrito(carrito) {

    localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
    );

}


/* =========================================================
   AGREGAR PRODUCTO
========================================================= */

function agregarAlCarrito(producto) {

    const carrito = obtenerCarrito();

    const productoExistente = carrito.find(
        item => item.id === producto.id
    );


    if (productoExistente) {

        productoExistente.cantidad += 1;

    } else {

        carrito.push({

            id: producto.id,

            nombre: producto.nombre,

            categoria: producto.categoria || "",

            precio: Number(producto.precio),

            imagen: producto.imagen,

            cantidad: 1

        });

    }


    guardarCarrito(carrito);

    actualizarContadorCarrito();

    mostrarMensajeAgregado(producto.nombre);

}


/* =========================================================
   ELIMINAR PRODUCTO
========================================================= */

function eliminarDelCarrito(id) {

    let carrito = obtenerCarrito();

    carrito = carrito.filter(
        producto => producto.id !== id
    );

    guardarCarrito(carrito);

    renderizarCarrito();

    actualizarContadorCarrito();

}


/* =========================================================
   CAMBIAR CANTIDAD
========================================================= */

function cambiarCantidad(id, cambio) {

    const carrito = obtenerCarrito();

    const producto = carrito.find(
        item => item.id === id
    );


    if (!producto) {
        return;
    }


    producto.cantidad += cambio;


    if (producto.cantidad <= 0) {

        eliminarDelCarrito(id);

        return;

    }


    guardarCarrito(carrito);

    renderizarCarrito();

    actualizarContadorCarrito();

}


/* =========================================================
   CALCULAR CANTIDAD TOTAL
========================================================= */

function obtenerCantidadTotal() {

    const carrito = obtenerCarrito();

    return carrito.reduce(
        (total, producto) =>
            total + producto.cantidad,
        0
    );

}


/* =========================================================
   CALCULAR SUBTOTAL
========================================================= */

function obtenerSubtotal() {

    const carrito = obtenerCarrito();

    return carrito.reduce(
        (total, producto) =>
            total +
            (Number(producto.precio) * producto.cantidad),
        0
    );

}


/* =========================================================
   FORMATEAR PRECIO
========================================================= */

function formatearPrecio(precio) {

    return Number(precio).toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    );

}


/* =========================================================
   ACTUALIZAR CONTADOR DEL CARRITO
========================================================= */

function actualizarContadorCarrito() {

    const cantidad = obtenerCantidadTotal();

    const contadores =
        document.querySelectorAll(
            ".contador-carrito"
        );


    contadores.forEach(contador => {

        contador.textContent = cantidad;

        if (cantidad > 0) {

            contador.classList.add(
                "activo"
            );

        } else {

            contador.classList.remove(
                "activo"
            );

        }

    });

}


/* =========================================================
   RENDERIZAR CARRITO
========================================================= */

function renderizarCarrito() {

    const contenedor =
        document.getElementById(
            "carritoProductos"
        );


    if (!contenedor) {
        return;
    }


    const carrito = obtenerCarrito();

    const carritoVacio =
        document.getElementById(
            "carritoVacio"
        );


    /* -----------------------------------------
       CARRITO VACÍO
    ----------------------------------------- */

    if (carrito.length === 0) {

        contenedor.innerHTML = "";

        contenedor.appendChild(
            crearCarritoVacio()
        );

        actualizarResumen();

        return;

    }


    /* -----------------------------------------
       PRODUCTOS
    ----------------------------------------- */

    contenedor.innerHTML = "";


    carrito.forEach(producto => {

        const elemento =
            crearProductoCarrito(producto);

        contenedor.appendChild(elemento);

    });


    actualizarResumen();

}


/* =========================================================
   CREAR MENSAJE CARRITO VACÍO
========================================================= */

function crearCarritoVacio() {

    const elemento =
        document.createElement("div");


    elemento.className =
        "carrito-vacio";


    elemento.innerHTML = `

        <div class="carrito-vacio-icono">

            <i class="fa-solid fa-bag-shopping"></i>

        </div>

        <h3>
            Tu carrito está vacío
        </h3>

        <p>
            Aún no has agregado ningún producto.
        </p>

        <a
            href="index.html"
            class="btn-seguir-comprando">

            <i class="fa-solid fa-arrow-left"></i>

            Seguir comprando

        </a>

    `;


    return elemento;

}


/* =========================================================
   CREAR PRODUCTO DEL CARRITO
========================================================= */

function crearProductoCarrito(producto) {

    const elemento =
        document.createElement("article");


    elemento.className =
        "carrito-producto";


    const subtotal =
        Number(producto.precio) *
        Number(producto.cantidad);


    elemento.innerHTML = `

        <div class="carrito-producto-imagen">

            <img
                src="${producto.imagen}"
                alt="${escaparHTML(producto.nombre)}"
            >

        </div>


        <div class="carrito-producto-info">

            <p class="carrito-producto-categoria">
                ${escaparHTML(producto.categoria || "Producto")}
            </p>

            <h3>
                ${escaparHTML(producto.nombre)}
            </h3>

            <p class="carrito-producto-precio">
                ${formatearPrecio(producto.precio)}
            </p>

        </div>


        <div class="carrito-producto-controles">

            <div class="cantidad-control">

                <button
                    type="button"
                    class="btn-cantidad-menos"
                    data-id="${producto.id}"
                    aria-label="Disminuir cantidad">

                    <i class="fa-solid fa-minus"></i>

                </button>


                <span>
                    ${producto.cantidad}
                </span>


                <button
                    type="button"
                    class="btn-cantidad-mas"
                    data-id="${producto.id}"
                    aria-label="Aumentar cantidad">

                    <i class="fa-solid fa-plus"></i>

                </button>

            </div>


            <span class="carrito-producto-subtotal">
                ${formatearPrecio(subtotal)}
            </span>


            <button
                type="button"
                class="btn-eliminar-producto"
                data-id="${producto.id}">

                <i class="fa-solid fa-trash"></i>

                Eliminar

            </button>

        </div>

    `;


    /* -----------------------------------------
       BOTÓN MENOS
    ----------------------------------------- */

    const btnMenos =
        elemento.querySelector(
            ".btn-cantidad-menos"
        );


    btnMenos.addEventListener(
        "click",
        function() {

            cambiarCantidad(
                producto.id,
                -1
            );

        }
    );


    /* -----------------------------------------
       BOTÓN MÁS
    ----------------------------------------- */

    const btnMas =
        elemento.querySelector(
            ".btn-cantidad-mas"
        );


    btnMas.addEventListener(
        "click",
        function() {

            cambiarCantidad(
                producto.id,
                1
            );

        }
    );


    /* -----------------------------------------
       BOTÓN ELIMINAR
    ----------------------------------------- */

    const btnEliminar =
        elemento.querySelector(
            ".btn-eliminar-producto"
        );


    btnEliminar.addEventListener(
        "click",
        function() {

            eliminarDelCarrito(
                producto.id
            );

        }
    );


    return elemento;

}


/* =========================================================
   ACTUALIZAR RESUMEN
========================================================= */

function actualizarResumen() {

    const cantidad =
        obtenerCantidadTotal();


    const subtotal =
        obtenerSubtotal();


    const cantidadElemento =
        document.getElementById(
            "cantidadProductos"
        );


    const subtotalElemento =
        document.getElementById(
            "subtotalCarrito"
        );


    const totalElemento =
        document.getElementById(
            "totalCarrito"
        );


    if (cantidadElemento) {

        cantidadElemento.textContent =
            cantidad;

    }


    if (subtotalElemento) {

        subtotalElemento.textContent =
            formatearPrecio(subtotal);

    }


    if (totalElemento) {

        totalElemento.textContent =
            formatearPrecio(subtotal);

    }

}


/* =========================================================
   MENSAJE PRODUCTO AGREGADO
========================================================= */

function mostrarMensajeAgregado(nombre) {

    const mensajeAnterior =
        document.querySelector(
            ".mensaje-carrito"
        );


    if (mensajeAnterior) {

        mensajeAnterior.remove();

    }


    const mensaje =
        document.createElement("div");


    mensaje.className =
        "mensaje-carrito";


    mensaje.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>
            ${escaparHTML(nombre)} agregado al carrito
        </span>

    `;


    document.body.appendChild(mensaje);


    setTimeout(() => {

        mensaje.classList.add(
            "mostrar"
        );

    }, 10);


    setTimeout(() => {

        mensaje.classList.remove(
            "mostrar"
        );

        setTimeout(() => {

            mensaje.remove();

        }, 300);

    }, 2500);

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto ?? "";

    return div.innerHTML;

}


/* =========================================================
   CONECTAR BOTONES "COMPRAR"
========================================================= */

function conectarBotonesComprar() {

    const botones =
        document.querySelectorAll(
            ".btn-comprar"
        );


    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const producto = {

                    id:
                        boton.dataset.id,

                    nombre:
                        boton.dataset.nombre,

                    categoria:
                        boton.dataset.categoria || "",

                    precio:
                        Number(
                            boton.dataset.precio
                        ),

                    imagen:
                        boton.dataset.imagen

                };


                /* --------------------------------
                   VALIDAR DATOS
                -------------------------------- */

                if (
                    !producto.id ||
                    !producto.nombre ||
                    !producto.precio ||
                    !producto.imagen
                ) {

                    console.error(
                        "El botón Comprar no tiene todos los datos necesarios:",
                        boton
                    );

                    return;

                }


                agregarAlCarrito(
                    producto
                );

            }
        );

    });

}


/* =========================================================
   BOTÓN FINALIZAR COMPRA
========================================================= */

function configurarFinalizarCompra() {

    const boton =
        document.getElementById(
            "btnFinalizarCompra"
        );


    if (!boton) {
        return;
    }


    boton.addEventListener(
        "click",
        function() {

            const carrito =
                obtenerCarrito();


            if (carrito.length === 0) {

                mostrarMensajeAgregado(
                    "Tu carrito está vacío"
                );

                return;

            }


            let mensaje =
                "Hola, quiero realizar una compra en Nicolle Store.%0A%0A";


            carrito.forEach(producto => {

                const subtotal =
                    Number(producto.precio) *
                    Number(producto.cantidad);


                mensaje +=
                    `• ${producto.nombre} x${producto.cantidad} - ${formatearPrecio(subtotal)}%0A`;

            });


            const total =
                obtenerSubtotal();


            mensaje +=
                `%0A*Total: ${formatearPrecio(total)}*`;


            /*
             * IMPORTANTE:
             * Aquí colocaremos posteriormente
             * el número real de WhatsApp de Nicolle Store.
             */

            const numeroWhatsApp =
                "";


            if (!numeroWhatsApp) {

                alert(
                    "El carrito está listo. Falta configurar el número de WhatsApp de Nicolle Store."
                );

                return;

            }


            const url =
                "https://wa.me/" +
                numeroWhatsApp +
                "?text=" +
                mensaje;


            window.open(
                url,
                "_blank"
            );

        }
    );

}


/* =========================================================
   INICIALIZAR CARRITO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        conectarBotonesComprar();

        renderizarCarrito();

        actualizarContadorCarrito();

        configurarFinalizarCompra();

    }
);
