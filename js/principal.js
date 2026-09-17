/* =========================================================
   NICOLLE STORE
   principal.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       AÑO AUTOMÁTICO DEL FOOTER
       ===================================================== */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       NEWSLETTER
       ===================================================== */

    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", (event) => {

            event.preventDefault();

            if (!newsletterEmail) {
                return;
            }

            const email = newsletterEmail.value.trim();

            if (!email) {
                showToast("Escribe tu correo electrónico.", "error");
                newsletterEmail.focus();
                return;
            }

            if (!isValidEmail(email)) {
                showToast("Ingresa un correo electrónico válido.", "error");
                newsletterEmail.focus();
                return;
            }

            /*
             * Aquí posteriormente podemos conectar el formulario
             * con una base de datos, API o sistema de suscripciones.
             */

            showToast("¡Gracias por suscribirte a Nicolle Store! ✦");

            newsletterForm.reset();
        });

    }


    /* =====================================================
       VALIDAR CORREO
       ===================================================== */

    function isValidEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);
    }


    /* =====================================================
       TOAST
       ===================================================== */

    window.showToast = function(message, type = "success") {

        const toast = document.getElementById("toast");

        if (!toast) {
            return;
        }

        const toastText = toast.querySelector("span");
        const toastIcon = toast.querySelector("i");

        if (toastText) {
            toastText.textContent = message;
        }

        if (toastIcon) {

            if (type === "error") {

                toastIcon.className = "fa-solid fa-circle-exclamation";

            } else {

                toastIcon.className = "fa-solid fa-check";

            }

        }

        toast.classList.remove("show", "error");

        if (type === "error") {
            toast.classList.add("error");
        }

        /*
         * Forzamos un pequeño reflow para permitir
         * que la animación se ejecute correctamente.
         */

        void toast.offsetWidth;

        toast.classList.add("show");

        clearTimeout(window.nicolleToastTimeout);

        window.nicolleToastTimeout = setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);
    };


    /* =====================================================
       ANIMACIONES AL HACER SCROLL
       ===================================================== */

    const animatedElements = document.querySelectorAll(
        ".intro-content, " +
        ".intro-label, " +
        ".section-heading, " +
        ".category-card, " +
        ".beauty-banner-image, " +
        ".beauty-banner-content, " +
        ".benefit-item, " +
        ".newsletter-box, " +
        ".footer-brand, " +
        ".footer-column"
    );

    if ("IntersectionObserver" in window && animatedElements.length) {

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    observerInstance.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        animatedElements.forEach((element, index) => {

            /*
             * Pequeño retraso para que las tarjetas
             * aparezcan de forma escalonada.
             */

            if (
                element.classList.contains("category-card") ||
                element.classList.contains("benefit-item")
            ) {

                element.style.transitionDelay =
                    `${Math.min(index * 70, 350)}ms`;
            }

            observer.observe(element);

        });

    } else {

        /*
         * Si el navegador no soporta IntersectionObserver,
         * mostramos directamente los elementos.
         */

        animatedElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    }


    /* =====================================================
       SUAVIZAR ENLACES INTERNOS
       ===================================================== */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length <= 1
            ) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       EFECTO SUAVE PARA LAS IMÁGENES DE CATEGORÍAS
       ===================================================== */

    const categoryCards = document.querySelectorAll(
        ".category-card"
    );

    categoryCards.forEach((card) => {

        const image = card.querySelector(
            ".category-image img"
        );

        if (!image) {
            return;
        }

        card.addEventListener("mouseenter", () => {

            image.style.transform = "scale(1.04)";

        });

        card.addEventListener("mouseleave", () => {

            image.style.transform = "scale(1)";

        });

    });


    /* =====================================================
       PREVENIR DOBLE ENVÍO DEL NEWSLETTER
       ===================================================== */

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", () => {

            const button = newsletterForm.querySelector(
                'button[type="submit"]'
            );

            if (!button) {
                return;
            }

            setTimeout(() => {

                button.blur();

            }, 100);

        });

    }


    /* =====================================================
       DETECTAR CARGA DE IMÁGENES
       ===================================================== */

    const images = document.querySelectorAll("img");

    images.forEach((image) => {

        if (image.complete) {

            image.classList.add("image-loaded");

        } else {

            image.addEventListener(
                "load",
                () => {
                    image.classList.add("image-loaded");
                },
                {
                    once: true
                }
            );

        }

        image.addEventListener(
            "error",
            () => {

                image.classList.add("image-error");

                console.warn(
                    "No se pudo cargar la imagen:",
                    image.src
                );

            },
            {
                once: true
            }
        );

    });


    /* =====================================================
       ANIMACIÓN INICIAL DEL HERO
       ===================================================== */

    const hero = document.querySelector(".hero");

    if (hero) {

        requestAnimationFrame(() => {

            hero.classList.add("hero-loaded");

        });

    }


    /* =====================================================
       LOG DE DESARROLLO
       ===================================================== */

    console.log(
        "✦ Nicolle Store — sitio cargado correctamente."
    );

});