// admin.js
document.addEventListener("DOMContentLoaded", initAdmin);

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(r => r.startsWith(name + '='))
    ?.split('=')[1];
}

async function initAdmin() {
  const params = new URLSearchParams(window.location.search);
  const interactionId = params.get("id_interaction");

  // Bind submit una sola vez
  document.getElementById("interactionForm").addEventListener("submit", saveInteraction);

  if (interactionId) {
    await loadInteraction(interactionId);
  } else {
    resetForm();
  }
}

/**
 * Cargar interacción existente
*/
async function loadInteraction(id) {
  try {
    const res = await fetch(`/api/interactions/${id}`);
    if (!res.ok) return alert("Error cargando interacción");
    const data = await res.json();

    fillForm(data);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Rellenar formulario
*/
function fillForm(data) {
  document.getElementById("id_interactions").value = data.id_interactions;
  document.getElementById("scene_id").value = data.scene_id;
  document.getElementById("title").value = data.title;
  document.getElementById("description").value = data.description || "";
}

/**
 * Guardar (POST si es nuevo / PUT si edita)
*/
async function saveInteraction(e) {
  e.preventDefault();

  const body = {
    id_interactions: document.getElementById("id_interactions").value || null,
    description: document.getElementById("description").value,
  };

  const url = `/api/interactions/${body.id_interactions}/description`;

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert("Guardado correctamente");
    window.location.href = "/tecnic";
  } else {
    alert("Error guardando datos");
  }
}

/**
 * Limpiar para crear nuevo
*/
function resetForm() {
  document.getElementById("interactionForm").reset();
  document.getElementById("id_interactions").value = "";
}

/**
 * Logout
*/
async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/admin/login";
}

