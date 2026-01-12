document.getElementById("loginForm").addEventListener("submit", login);

async function login(e) {
  e.preventDefault();

  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  const params = new URLSearchParams(window.location.search);
  const interactionId = params.get("id_interaction");

  const body = { user, pass };
  if (interactionId) body.interactionId = interactionId;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    // 🚀 conservar interactionId para admin
    if (interactionId) {
      window.location.href = `/admin?id_interaction=${interactionId}`;
    } else {
      window.location.href = "/admin";
    }
  } else {
    document.getElementById("error").innerText =
      "Usuario o contraseña incorrectos";
  }
}