
document.addEventListener("DOMContentLoaded", () => {

    const sobre = document.getElementById("sobre");
    const sello = document.getElementById("abrirSobre");

    if (!sobre || !sello) return;

    let abriendo = false;

    sello.addEventListener("click", (e) => {

        e.preventDefault();

        if (abriendo) return;

        abriendo = true;

        // Obtener la URL de destino original
        const destino = new URL(sello.href, window.location.origin);

        // Leer los cupos de la URL del sobre
        const parametros = new URLSearchParams(window.location.search);
        const cupos = parametros.get("cupos");

        // Conservar los cupos únicamente si son de 2 a 6
        if (/^[2-6]$/.test(cupos || "")) {
            destino.searchParams.set("cupos", cupos);
        }

        // Mantener la animación original
        sobre.classList.add("abriendo");

        const reducirMovimiento = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        setTimeout(() => {
            window.location.href = destino.href;
        }, reducirMovimiento ? 0 : 800);

    });

    // Restaurar el sobre si el usuario vuelve atrás
    window.addEventListener("pageshow", () => {

        sobre.classList.remove("abriendo");
        abriendo = false;

    });

});
