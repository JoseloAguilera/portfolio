const DEFAULT_TO = "joseaguilera1709@gmail.com";

function isValidEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Método no permitido" });
  }

  const { nombre = "", email = "", mensaje = "" } = request.body || {};
  const cleanNombre = String(nombre).trim();
  const cleanEmail = String(email).trim();
  const cleanMensaje = String(mensaje).trim();

  if (!cleanNombre || !isValidEmail(cleanEmail) || cleanMensaje.length < 5) {
    return response.status(400).json({ error: "Completá nombre, email válido y mensaje." });
  }

  const recipient = process.env.CONTACT_TO || DEFAULT_TO;
  const formSubmitResponse = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: cleanNombre,
      email: cleanEmail,
      message: cleanMensaje,
      _subject: `Nuevo contacto desde joseaguilera.live - ${cleanNombre}`,
      _template: "table",
      _captcha: "false",
      _replyto: cleanEmail,
    }),
  });

  const resultText = await formSubmitResponse.text();

  if (!formSubmitResponse.ok) {
    console.error("FormSubmit error", formSubmitResponse.status, resultText);
    return response.status(502).json({ error: "No se pudo enviar el mensaje. Probá por WhatsApp o email directo." });
  }

  return response.status(200).json({ ok: true });
}
