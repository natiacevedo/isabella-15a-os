document.addEventListener("DOMContentLoaded", () => {

    const sobre = document.getElementById("sobre");
    const sello = document.getElementById("abrirSobre");

    if (!sobre || !sello) return;

    let abriendo = false;

    sello.addEventListener("click", (e) => {

        e.preventDefault();

        if (abriendo) return;

        abriendo = true;

        const destino = sello.href;

        sobre.classList.add("abriendo");

        const reducirMovimiento = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        setTimeout(() => {
            window.location.href = destino;
        }, reducirMovimiento ? 0 : 800);

    });

    // Restaurar el sobre si el usuario vuelve atrás

    window.addEventListener("pageshow", () => {

        sobre.classList.remove("abriendo");
        abriendo = false;

    });

});