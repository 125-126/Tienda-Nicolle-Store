/* =========================================================
   NICOLLE STORE
   SISTEMA DE CARRITO
========================================================= */

const CLAVE_CARRITO = "nicolleStoreCarrito";
const NUMERO_WHATSAPP = "50360014234";


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

        if (!Array.isArray(carrito)) {
            return [];
        }

        return carrito.map(producto => ({

            id: producto.id || "",

            nombre: producto.nombre || "Producto",

            categoria: producto.categoria || "Producto",

            precio: Number(producto.precio) || 0,

            imagen: producto.imagen || "",

            cantidad: Math.max(
                1,
                Number(producto.cantidad) || 1
            )

        }));

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

    try {

        localStorage.setItem(
            CLAVE_CARRITO,
            JSON.stringify(carrito)
        );

    } catch (error) {

        console.error(
            "Error al guardar el carrito:",
            error
        );

    }

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

            categoria: producto.categoria || "Producto",

            precio: Number(producto.precio) || 0,

            imagen: producto.imagen || "",

            cantidad: 1

        });

    }


    guardarCarrito(carrito);

    actualizarContadorCarrito();

    mostrarMensajeAgregado(
        producto.nombre
    );

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
   VACIAR CARRITO
========================================================= */

function vaciarCarrito() {

    guardarCarrito([]);

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
   CANTIDAD TOTAL
========================================================= */

function obtenerCantidadTotal() {

    const carrito = obtenerCarrito();

    return carrito.reduce(
        (total, producto) => {

            return total +
                Number(producto.cantidad);

        },
        0
    );

}


/* =========================================================
   SUBTOTAL
========================================================= */

function obtenerSubtotal() {

    const carrito = obtenerCarrito();

    return carrito.reduce(
        (total, producto) => {

            return total +
                (
                    Number(producto.precio) *
                    Number(producto.cantidad)
                );

        },
        0
    );

}


/* =========================================================
   FORMATEAR PRECIO
========================================================= */

function formatearPrecio(precio) {

    return Number(precio || 0).toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    );

}


/* =========================================================
   ACTUALIZAR CONTADOR
========================================================= */

function actualizarContadorCarrito() {

    const cantidad =
        obtenerCantidadTotal();


    const contadores =
        document.querySelectorAll(
            ".contador-carrito"
        );


    contadores.forEach(contador => {

        contador.textContent =
            cantidad;

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


    const idsContador = [
        "cartBadge",
        "cartBadgeMobile"
    ];


    idsContador.forEach(id => {

        const contador =
            document.getElementById(id);

        if (!contador) {
            return;
        }

        contador.textContent =
            cantidad;

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


    const carrito =
        obtenerCarrito();


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
       LIMPIAR CONTENEDOR
    ----------------------------------------- */

    contenedor.innerHTML = "";


    /* -----------------------------------------
       CREAR PRODUCTOS
    ----------------------------------------- */

    carrito.forEach(producto => {

        const elemento =
            crearProductoCarrito(producto);

        contenedor.appendChild(elemento);

    });


    actualizarResumen();

}


/* =========================================================
   CARRITO VACÍO
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
   CREAR PRODUCTO
========================================================= */

function crearProductoCarrito(producto) {

    const elemento =
        document.createElement("article");


    elemento.className =
        "carrito-producto";


    const subtotal =
        Number(producto.precio) *
        Number(producto.cantidad);


    /*
     * IMPORTANTE:
     * Las imágenes de las páginas de categoría
     * vienen con rutas como:
     *
     * ../img/categorias/cabello.jpeg
     *
     * Al estar carrito.html en la raíz,
     * esa ruta necesita convertirse a:
     *
     * img/categorias/cabello.jpeg
     */

    let imagen =
        producto.imagen ||
        "img/categorias/portada.jpeg";


    if (imagen.startsWith("../")) {

        imagen =
            imagen.replace(
                /^\.\.\//,
                ""
            );

    }


    elemento.innerHTML = `

        <!-- IMAGEN -->

        <div class="carrito-producto-imagen">

            <img
                src="${escaparHTML(imagen)}"
                alt="${escaparHTML(producto.nombre)}"
            >

        </div>


        <!-- INFORMACIÓN -->

        <div class="carrito-producto-info">

            <p class="carrito-producto-categoria">
                ${escaparHTML(
                    producto.categoria || "Producto"
                )}
            </p>

            <h3>
                ${escaparHTML(
                    producto.nombre || "Producto"
                )}
            </h3>

            <p class="carrito-producto-precio">
                ${formatearPrecio(
                    producto.precio
                )}
            </p>

        </div>


        <!-- CONTROLES -->

        <div class="carrito-producto-controles">

            <div class="cantidad-control">

                <button
                    type="button"
                    class="btn-cantidad-menos"
                    data-id="${escaparHTML(producto.id)}"
                    aria-label="Disminuir cantidad">

                    <i class="fa-solid fa-minus"></i>

                </button>


                <span class="cantidad-numero">
                    ${producto.cantidad}
                </span>


                <button
                    type="button"
                    class="btn-cantidad-mas"
                    data-id="${escaparHTML(producto.id)}"
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
                data-id="${escaparHTML(producto.id)}">

                <i class="fa-solid fa-trash"></i>

                Eliminar

            </button>

        </div>

    `;


    /* =====================================================
       BOTÓN MENOS
    ===================================================== */

    const btnMenos =
        elemento.querySelector(
            ".btn-cantidad-menos"
        );


    if (btnMenos) {

        btnMenos.addEventListener(
            "click",
            function() {

                cambiarCantidad(
                    producto.id,
                    -1
                );

            }
        );

    }


    /* =====================================================
       BOTÓN MÁS
    ===================================================== */

    const btnMas =
        elemento.querySelector(
            ".btn-cantidad-mas"
        );


    if (btnMas) {

        btnMas.addEventListener(
            "click",
            function() {

                cambiarCantidad(
                    producto.id,
                    1
                );

            }
        );

    }


    /* =====================================================
       ELIMINAR
    ===================================================== */

    const btnEliminar =
        elemento.querySelector(
            ".btn-eliminar-producto"
        );


    if (btnEliminar) {

        btnEliminar.addEventListener(
            "click",
            function() {

                eliminarDelCarrito(
                    producto.id
                );

            }
        );

    }


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


    const envioElemento =
        document.getElementById(
            "envioCarrito"
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


    if (envioElemento) {

        envioElemento.textContent =
            "Por calcular";

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
            ${escaparHTML(nombre)}
            agregado al carrito
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

            if (mensaje.parentNode) {

                mensaje.remove();

            }

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
   BOTONES COMPRAR
========================================================= */

function conectarBotonesComprar() {

    const botones =
        document.querySelectorAll(
            ".btn-comprar"
        );


    botones.forEach(boton => {

        if (
            boton.dataset.carritoConectado === "true"
        ) {

            return;

        }


        boton.dataset.carritoConectado =
            "true";


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
                        boton.dataset.categoria || "Producto",

                    precio:
                        Number(
                            boton.dataset.precio
                        ),

                    imagen:
                        boton.dataset.imagen

                };


                if (
                    !producto.id ||
                    !producto.nombre ||
                    !Number.isFinite(producto.precio) ||
                    producto.precio <= 0 ||
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
   FINALIZAR COMPRA POR WHATSAPP
========================================================= */

function configurarFinalizarCompra() {

    const boton =
        document.getElementById(
            "btnFinalizarCompra"
        );


    if (!boton) {
        return;
    }


    if (
        boton.dataset.whatsappConfigurado === "true"
    ) {

        return;

    }


    boton.dataset.whatsappConfigurado =
        "true";


    boton.addEventListener(
        "click",
        function() {

            const carrito =
                obtenerCarrito();


            /* -----------------------------------------
               VALIDAR CARRITO
            ----------------------------------------- */

            if (carrito.length === 0) {

                mostrarMensajeAgregado(
                    "Tu carrito está vacío"
                );

                return;

            }


            /* -----------------------------------------
               DATOS GENERALES
            ----------------------------------------- */

            const cantidadTotal =
                obtenerCantidadTotal();


            const subtotal =
                obtenerSubtotal();


            /* -----------------------------------------
               CONSTRUIR MENSAJE
            ----------------------------------------- */

            let mensaje =
                "✨ *NICOLLE STORE* ✨\n" +
                "Beauty & Style 💕\n\n";


            mensaje +=
                "🛍️ *NUEVA SOLICITUD DE COMPRA*\n\n";


            mensaje +=
                "Hola, me gustaría realizar la siguiente compra:\n\n";


            mensaje +=
                "━━━━━━━━━━━━━━━━━━━━\n";


            mensaje +=
                "📦 *DETALLE DEL PEDIDO*\n";


            mensaje +=
                "━━━━━━━━━━━━━━━━━━━━\n\n";


            /* -----------------------------------------
               PRODUCTOS
            ----------------------------------------- */

            carrito.forEach(
                function(producto, indice) {

                    const precioUnitario =
                        Number(producto.precio);


                    const cantidad =
                        Number(producto.cantidad);


                    const subtotalProducto =
                        precioUnitario * cantidad;


                    mensaje +=
                        `🛍️ *${producto.nombre}*\n`;


                    if (producto.categoria) {

                        mensaje +=
                            `   Categoría: ${producto.categoria}\n`;

                    }


                    mensaje +=
                        `   Cantidad: ${cantidad}\n`;


                    mensaje +=
                        `   Precio unitario: ${formatearPrecio(precioUnitario)}\n`;


                    mensaje +=
                        `   Subtotal: *${formatearPrecio(subtotalProducto)}*\n\n`;


                    if (
                        indice <
                        carrito.length - 1
                    ) {

                        mensaje +=
                            "────────────────────\n\n";

                    }

                }
            );


            /* -----------------------------------------
               RESUMEN
            ----------------------------------------- */

            mensaje +=
                "━━━━━━━━━━━━━━━━━━━━\n";


            mensaje +=
                "🧾 *RESUMEN DEL PEDIDO*\n";


            mensaje +=
                "━━━━━━━━━━━━━━━━━━━━\n\n";


            mensaje +=
                `📦 Productos: ${cantidadTotal}\n`;


            mensaje +=
                `💰 Subtotal: ${formatearPrecio(subtotal)}\n`;


            mensaje +=
                "🚚 Envío: Por calcular\n";


            mensaje +=
                `\n💳 *TOTAL: ${formatearPrecio(subtotal)}*\n\n`;


            /* -----------------------------------------
               MENSAJE FINAL
            ----------------------------------------- */

            mensaje +=
                "━━━━━━━━━━━━━━━━━━━━\n";


            mensaje +=
                "📲 *DATOS DE ENTREGA*\n";


            mensaje +=
                "━━━━━━━━━━━━━━━━━━━━\n\n";


            mensaje +=
                "Por favor, indícame la información necesaria para coordinar mi pedido y entrega.\n\n";


            mensaje +=
                "📍 Dirección o zona:\n";


            mensaje +=
                "📞 Teléfono:\n";


            mensaje +=
                "👤 Nombre:\n\n";


            mensaje +=
                "💗 Gracias por elegir *Nicolle Store*.\n";


            mensaje +=
                "Esperamos atenderte muy pronto. ✨";


            /* -----------------------------------------
               CREAR URL DE WHATSAPP
            ----------------------------------------- */

            const url =
                "https://wa.me/" +
                NUMERO_WHATSAPP +
                "?text=" +
                encodeURIComponent(mensaje);


            /* -----------------------------------------
               ABRIR WHATSAPP
            ----------------------------------------- */

            window.open(
                url,
                "_blank"
            );

        }
    );

}


/* =========================================================
   SINCRONIZAR LOCALSTORAGE
========================================================= */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key === CLAVE_CARRITO
        ) {

            renderizarCarrito();

            actualizarContadorCarrito();

        }

    }
);


/* =========================================================
   INICIALIZAR
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
