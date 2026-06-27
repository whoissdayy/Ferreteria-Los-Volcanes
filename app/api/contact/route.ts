// Ruta de servidor (Route Handler de Next.js): nunca corre en el navegador del cliente.
// Recibe los datos del formulario de "Hablemos" y envía el correo real a la ferretería
// usando la API REST de Resend directo con fetch (no el paquete "resend" de npm: no se
// pudo instalar por una restricción de red del entorno de este turno; la API REST hace
// exactamente lo mismo sin necesitar el SDK).
const RESEND_API_URL = "https://api.resend.com/emails";

// Correo de prueba de destino — CAMBIAR por el correo real de la ferretería antes de
// publicar el sitio en producción.
const DESTINATION_EMAIL = "linkdeyh26@gmail.com";

type ContactBody = {
  nombre?: string;
  correo?: string;
  celular?: string;
  mensaje?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Falta RESEND_API_KEY en las variables de entorno.");
    return Response.json(
      { error: "El servidor no está configurado para enviar correos todavía." },
      { status: 500 }
    );
  }

  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const { nombre, correo, celular, mensaje } = body;
  if (!nombre || !correo || !celular || !mensaje) {
    return Response.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }

  try {
    const resendRes = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // onboarding@resend.dev: dominio de prueba de Resend, funciona sin verificar un
        // dominio propio siempre que el destinatario sea el correo con el que se creó la
        // cuenta de Resend — suficiente para pruebas. Para producción con el correo real
        // de la ferretería conviene verificar el dominio propio del negocio en Resend.
        from: "Ferretería Los Volcanes <onboarding@resend.dev>",
        to: DESTINATION_EMAIL,
        reply_to: correo,
        subject: `Nuevo mensaje de contacto — ${nombre}`,
        text: `Nombre: ${nombre}\nCorreo: ${correo}\nCelular: ${celular}\n\nMensaje:\n${mensaje}`,
      }),
    });

    if (!resendRes.ok) {
      const errorBody = await resendRes.text();
      console.error("Resend respondió con error:", resendRes.status, errorBody);
      return Response.json({ error: "No se pudo enviar el mensaje." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Error de red enviando correo de contacto:", error);
    return Response.json({ error: "No se pudo enviar el mensaje." }, { status: 500 });
  }
}
