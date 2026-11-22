
/* =========================================
   REPRODUCTOR DE MÚSICA
========================================= */

const musica = document.getElementById("musica");
const botonMusica = document.getElementById("boton-musica");
const iconoMusica = document.getElementById("icono-musica");

if (musica && botonMusica && iconoMusica) {

    musica.volume = 0.5;

    function actualizarIcono() {
        if (musica.paused) {
            iconoMusica.innerHTML = '<path d="M8 5v14l11-7z"/>';
            botonMusica.setAttribute("aria-label", "Reproducir música");
        } else {
            iconoMusica.innerHTML = '<path d="M6 5h4v14H6z M14 5h4v14h-4z"/>';
            botonMusica.setAttribute("aria-label", "Pausar música");
        }
    }

    botonMusica.addEventListener("click", async () => {
        if (musica.paused) {
            try {
                await musica.play();
            } catch (error) {
                console.log("No se pudo reproducir la música");
            }
        } else {
            musica.pause();
        }
    });

    musica.addEventListener("play", actualizarIcono);
    musica.addEventListener("pause", actualizarIcono);

    // Intentar reproducir al ingresar a la invitación
    actualizarIcono();

    musica.play().catch(() => {
        actualizarIcono();
    });
}


/* =========================================
   CUENTA REGRESIVA
========================================= */

// 19 de diciembre de 2026, 21 hs Uruguay (UTC-3)

const targetDate = new Date("2026-12-19T21:00:00-03:00").getTime();

function actualizarCuentaRegresiva() {

    const contenedor = document.getElementById("countdown");

    if (!contenedor) return false;

    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) {
        contenedor.textContent = "¡Llegó el gran día! ✨";
        return false;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    const valores = {
        days,
        hours,
        minutes,
        seconds
    };

    Object.entries(valores).forEach(([id, valor]) => {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = String(valor).padStart(2, "0");
        }
    });

    return true;
}

if (actualizarCuentaRegresiva()) {

    const countdown = setInterval(() => {

        if (!actualizarCuentaRegresiva()) {
            clearInterval(countdown);
        }

    }, 1000);
}


/* =========================================
   COPIAR CUENTAS BANCARIAS
========================================= */

async function copiarCuenta(numero, boton) {

    const textoOriginal = boton.textContent;

    try {

        await navigator.clipboard.writeText(numero);

        boton.textContent = "✓ ¡Copiado!";
        boton.disabled = true;

        setTimeout(() => {

            boton.textContent = textoOriginal;
            boton.disabled = false;

        }, 2000);

    } catch (error) {

        alert(
            "No se pudo copiar el número. Podés seleccionarlo manualmente."
        );

    }
}


/* =========================================
   GALERÍA DE FOTOGRAFÍAS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const fotos = Array.from(
        document.querySelectorAll(
            ".galeria-personalizada .galeria-foto img"
        )
    );

    const visor = document.getElementById("visorGaleria");
    const imagenAmpliada = document.getElementById("imagenAmpliada");

    if (!visor || !imagenAmpliada || fotos.length === 0) {
        return;
    }

    const cerrar = visor.querySelector(".visor-cerrar");
    const anterior = visor.querySelector(".visor-anterior");
    const siguiente = visor.querySelector(".visor-siguiente");

    if (!cerrar || !anterior || !siguiente) return;

    let indiceActual = 0;
    let elementoAnterior = null;
    let overflowAnterior = "";
    let inicioX = 0;
    let inicioY = 0;


    // Mostrar fotografía

    function mostrarFoto(indice) {

        indiceActual = (indice + fotos.length) % fotos.length;

        imagenAmpliada.src = fotos[indiceActual].src;
        imagenAmpliada.alt = fotos[indiceActual].alt;

    }


    // Abrir visor

    function abrirVisor(indice) {

        elementoAnterior = fotos[indice];
        overflowAnterior = document.body.style.overflow;

        mostrarFoto(indice);

        visor.classList.add("activo");
        visor.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        cerrar.focus();

    }


    // Cerrar visor

    function cerrarVisor() {

        visor.classList.remove("activo");

        document.body.style.overflow = overflowAnterior;

        imagenAmpliada.removeAttribute("src");

        if (elementoAnterior) {
            elementoAnterior.focus();
        }

        visor.setAttribute("aria-hidden", "true");

    }


    // Abrir fotografía al hacer clic

    fotos.forEach((foto, indice) => {

        foto.setAttribute("tabindex", "0");
        foto.setAttribute("role", "button");
        foto.setAttribute("aria-label", "Ampliar " + foto.alt);

        foto.addEventListener("click", () => {

            abrirVisor(indice);

        });

        foto.addEventListener("keydown", (e) => {

            if (e.key === "Enter" || e.key === " ") {

                e.preventDefault();
                abrirVisor(indice);

            }

        });

    });


    // Botones de navegación

    siguiente.addEventListener("click", () => {

        mostrarFoto(indiceActual + 1);

    });

    anterior.addEventListener("click", () => {

        mostrarFoto(indiceActual - 1);

    });

    cerrar.addEventListener("click", cerrarVisor);


    // Cerrar al tocar fuera de la fotografía

    visor.addEventListener("click", (e) => {

        if (e.target === visor) {
            cerrarVisor();
        }

    });


    // Navegación mediante teclado

    document.addEventListener("keydown", (e) => {

        if (!visor.classList.contains("activo")) return;

        if (e.key === "Escape") {
            cerrarVisor();
        }

        if (e.key === "ArrowRight") {
            e.preventDefault();
            mostrarFoto(indiceActual + 1);
        }

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            mostrarFoto(indiceActual - 1);
        }

        if (e.key === "Tab") {

            const controles = [cerrar, anterior, siguiente];
            const indice = controles.indexOf(document.activeElement);

            if (e.shiftKey && indice <= 0) {

                e.preventDefault();
                siguiente.focus();

            } else if (!e.shiftKey && indice === controles.length - 1) {

                e.preventDefault();
                cerrar.focus();

            }

        }

    });


    // Deslizar fotografías en mobile

    visor.addEventListener("touchstart", (e) => {

        inicioX = e.changedTouches[0].screenX;
        inicioY = e.changedTouches[0].screenY;

    }, { passive: true });

    visor.addEventListener("touchend", (e) => {

        const finX = e.changedTouches[0].screenX;
        const finY = e.changedTouches[0].screenY;

        const diferenciaX = inicioX - finX;
        const diferenciaY = inicioY - finY;

        if (
            Math.abs(diferenciaX) > 50 &&
            Math.abs(diferenciaX) > Math.abs(diferenciaY)
        ) {

            if (diferenciaX > 0) {
                mostrarFoto(indiceActual + 1);
            } else {
                mostrarFoto(indiceActual - 1);
            }

        }

    }, { passive: true });

});



/* =========================================
   FORMULARIO DE CONFIRMACIÓN
   ISABELLA XV - 2026
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formConfirmacion");

    if (!formulario) return;

    const btn = document.getElementById("enviar");
    const estado = document.getElementById("estado");

    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const detalle = document.getElementById("detalle");
    const mensaje = document.getElementById("mensaje");

    let enviando = false;


    /* OBTENER RESPUESTAS */

    const valor = (name) => {
        return formulario.querySelector(
            `[name="${name}"]:checked`
        )?.value || "";
    };


    /* MOSTRAR U OCULTAR CAMPOS */

    function mostrar(id, condicion) {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.classList.toggle("oculto", !condicion);
        }

    }


    /* ACTUALIZAR CAMPOS CONDICIONALES */

    function actualizar() {

        const asiste = valor("asiste") === "Sí";

        const tieneRestriccion =
            asiste && valor("restriccion") === "Sí";

        mostrar("camposAsistencia", asiste);

        mostrar("cajaDetalle", tieneRestriccion);

        detalle.required = tieneRestriccion;
        detalle.disabled = !tieneRestriccion;

        formulario.querySelectorAll(
            '[name="restriccion"]'
        ).forEach((radio) => {
            radio.disabled = !asiste;
        });

    }

    formulario.addEventListener("change", actualizar);

    actualizar();


    /* ENVIAR CONFIRMACIÓN */

    formulario.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (enviando) return;

        actualizar();

        if (!formulario.reportValidity()) return;


        /* VALIDAR DATOS */

        if (!nombre.value.trim() || !apellido.value.trim()) {

            estado.className = "estado error";

            estado.textContent =
                "Por favor, completá tu nombre y apellido.";

            return;

        }

        const asiste = valor("asiste") === "Sí";

        const tieneRestriccion =
            asiste && valor("restriccion") === "Sí";

        if (tieneRestriccion && !detalle.value.trim()) {

            estado.className = "estado error";

            estado.textContent =
                "Por favor, indicá tu restricción alimentaria.";

            detalle.focus();

            return;

        }


        /* PREPARAR DATOS */

        const datos = {

            nombre: nombre.value.trim(),

            apellido: apellido.value.trim(),

            asiste: valor("asiste"),

            restriccion: asiste
                ? valor("restriccion")
                : "",

            detalle: tieneRestriccion
                ? detalle.value.trim()
                : "",

            mensaje: mensaje.value.trim()

        };


        /* ESTADO DE CARGA */

        enviando = true;

        btn.disabled = true;

        btn.textContent = "Enviando...";

        estado.className = "estado";

        estado.textContent =
            "Registrando tu confirmación...";


        try {

            /* CONEXIÓN CON NETLIFY */

            const respuesta = await fetch(
                "/.netlify/functions/confirmacion",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(datos)
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok || resultado.ok !== true) {
                throw new Error("No se pudo guardar la respuesta.");
            }


            /* CONFIRMACIÓN EXITOSA */

            estado.className = "estado ok";

            estado.textContent = asiste
                ? "¡Gracias por confirmar! Nos vemos el 19 de diciembre. 💗"
                : "¡Gracias por avisarme! 💗";

            formulario.reset();

            actualizar();


        } catch (error) {

            console.error(error);

            estado.className = "estado error";

            estado.textContent =
                "No pudimos verificar tu confirmación. Intentá nuevamente.";

        } finally {

            enviando = false;

            btn.disabled = false;

            btn.textContent = "Enviar confirmación";

        }

    });

});


/* =========================================
   INVITACIONES CON CUPOS: 2 A 6 PERSONAS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const parametros = new URLSearchParams(window.location.search);
    const valorCupos = parametros.get("cupos");

    const cupos = /^[2-6]$/.test(valorCupos || "")
        ? Number(valorCupos)
        : 1;

    const formularioIndividual = document.getElementById("formConfirmacion");
    const seccionGrupal = document.getElementById("confirmacionGrupal");

    // El enlace original mantiene el formulario individual.
    if (cupos === 1) return;

    const formularioGrupal = document.getElementById("formConfirmacionGrupal");
    const cantidadCupos = document.getElementById("cantidadCupos");
    const cantidadAsistentes = document.getElementById("cantidadAsistentes");
    const listaInvitados = document.getElementById("listaInvitados");
    const estadoGrupal = document.getElementById("estadoGrupal");

    if (
        !formularioIndividual ||
        !seccionGrupal ||
        !formularioGrupal ||
        !cantidadCupos ||
        !cantidadAsistentes ||
        !listaInvitados
    ) return;

    // Mostrar únicamente el formulario grupal.
    formularioIndividual.hidden = true;
    seccionGrupal.hidden = false;

    cantidadCupos.textContent = `${cupos} personas`;

    // Crear las opciones según los cupos disponibles.
    cantidadAsistentes.innerHTML =
        '<option value="">Seleccioná una opción</option>';

    for (let i = 0; i <= cupos; i++) {

        const opcion = document.createElement("option");

        opcion.value = String(i);
        opcion.textContent = i === 0
            ? "Ninguna persona"
            : `${i} ${i === 1 ? "persona" : "personas"}`;

        cantidadAsistentes.appendChild(opcion);
    }

    function crearInvitado(numero) {

        const invitado = document.createElement("div");
        invitado.className = "invitado";

        invitado.innerHTML = `
            <h4>Invitado ${numero}</h4>

            <div class="campo">
                <label for="nombreGrupo${numero}">Nombre *</label>
                <input
                    id="nombreGrupo${numero}"
                    type="text"
                    maxlength="80"
                    required>
            </div>

            <div class="campo mt-3">
                <label for="apellidoGrupo${numero}">Apellido *</label>
                <input
                    id="apellidoGrupo${numero}"
                    type="text"
                    maxlength="80"
                    required>
            </div>

            <fieldset class="mt-3">
                <legend>¿Tiene alguna restricción alimentaria?</legend>

                <label>
                    <input
                        type="radio"
                        name="restriccionGrupo${numero}"
                        value="No"
                        checked>
                    No
                </label>

                <label class="ms-3">
                    <input
                        type="radio"
                        name="restriccionGrupo${numero}"
                        value="Sí">
                    Sí
                </label>
            </fieldset>

            <div class="campo mt-3" hidden>
                <label for="detalleGrupo${numero}">¿Cuál? *</label>
                <textarea
                    id="detalleGrupo${numero}"
                    maxlength="500"
                    placeholder="Celíaco/a, vegetariano/a, alergias..."></textarea>
            </div>
        `;

        const radios = invitado.querySelectorAll(
            `input[name="restriccionGrupo${numero}"]`
        );

        const cajaDetalle = invitado.querySelector("fieldset + .campo");
        const detalle = invitado.querySelector(`#detalleGrupo${numero}`);

        radios.forEach(radio => {

            radio.addEventListener("change", () => {

                const tieneRestriccion =
                    invitado.querySelector(
                        `input[name="restriccionGrupo${numero}"]:checked`
                    )?.value === "Sí";

                cajaDetalle.hidden = !tieneRestriccion;
                detalle.required = tieneRestriccion;

                if (!tieneRestriccion) detalle.value = "";
            });

        });

        return invitado;
    }

    // Generar los campos de los asistentes.
    cantidadAsistentes.addEventListener("change", () => {

        listaInvitados.innerHTML = "";

        const cantidad = Number(cantidadAsistentes.value);

        if (!Number.isInteger(cantidad) || cantidad < 0 || cantidad > cupos) {
            return;
        }

        for (let i = 1; i <= cantidad; i++) {
            listaInvitados.appendChild(crearInvitado(i));
        }

    });

    
    /* =========================================
    ENVIAR CONFIRMACIÓN GRUPAL
    ========================================= */

    let enviandoGrupo = false;

    formularioGrupal.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (enviandoGrupo) return;

        const cantidad = Number(cantidadAsistentes.value);

        if (
            cantidadAsistentes.value === "" ||
            !Number.isInteger(cantidad) ||
            cantidad < 0 ||
            cantidad > cupos
        ) {
            estadoGrupal.textContent =
                "Seleccioná una cantidad válida de asistentes.";
            return;
        }

        if (!formularioGrupal.reportValidity()) return;

        const invitados = [];

        for (let i = 1; i <= cantidad; i++) {

            const nombre = document
                .getElementById(`nombreGrupo${i}`)
                .value.trim();

            const apellido = document
                .getElementById(`apellidoGrupo${i}`)
                .value.trim();

            const restriccion = formularioGrupal.querySelector(
                `input[name="restriccionGrupo${i}"]:checked`
            )?.value || "No";

            const detalle = restriccion === "Sí"
                ? document.getElementById(`detalleGrupo${i}`).value.trim()
                : "";

            if (!nombre || !apellido || (restriccion === "Sí" && !detalle)) {
                estadoGrupal.textContent =
                    `Revisá los datos del invitado ${i}.`;
                return;
            }

            invitados.push({
                nombre,
                apellido,
                restriccion,
                detalle
            });
        }

        const datos = {
            tipo: "grupal",
            cupos,
            invitados,
            mensaje: document.getElementById("mensajeGrupal").value.trim()
        };

        const boton = document.getElementById("enviarGrupal");

        enviandoGrupo = true;
        boton.disabled = true;
        boton.textContent = "Enviando...";

        estadoGrupal.textContent = "Registrando confirmación...";

        try {

            const respuesta = await fetch(
                "/.netlify/functions/confirmacion",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok || resultado.ok !== true) {
                throw new Error("No se pudo guardar la confirmación.");
            }

            estadoGrupal.textContent = cantidad === 0
                ? "¡Gracias por avisarme! 💗"
                : `¡Gracias por confirmar a ${cantidad} ${
                    cantidad === 1 ? "persona" : "personas"
                }! Nos vemos el 19 de diciembre. 💗`;

            formularioGrupal.reset();
            listaInvitados.innerHTML = "";

        } catch (error) {

            console.error(error);

            estadoGrupal.textContent =
                "No se pudo registrar la confirmación. Intentá nuevamente.";

        } finally {

            enviandoGrupo = false;
            boton.disabled = false;
            boton.textContent = "Enviar confirmación";

        }

    });

});
