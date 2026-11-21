
/* CONFIRMACIONES ISABELLA XV */

export default async function (request) {

    const responder = (datos, status = 200) => {
        return new Response(JSON.stringify(datos), {
            status,
            headers: {
                "Content-Type": "application/json"
            }
        });
    };

    if (request.method !== "POST") {
        return responder({
            ok: false,
            mensaje: "Método no permitido."
        }, 405);
    }

    try {

        const url = process.env.ISABELLA_APPS_SCRIPT_URL;

        if (!url) {
            throw new Error("Falta configurar la URL de Apps Script.");
        }

        const datos = await request.json();

        datos.evento = "isabella-xv-2026";

        const respuesta = await fetch(url, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=UTF-8"
            },

            body: JSON.stringify(datos),

            redirect: "follow"

        });

        if (!respuesta.ok) {
            throw new Error("Error de conexión con Google.");
        }

        const resultado = await respuesta.json();

        return responder(
            resultado,
            resultado.ok ? 200 : 400
        );

    } catch (error) {

        console.error(error.message);

        return responder({
            ok: false,
            mensaje: "No se pudo registrar la confirmación."
        }, 502);

    }

}
