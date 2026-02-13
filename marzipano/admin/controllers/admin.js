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
  document.getElementById("yaw").value = data.yaw;
  document.getElementById("pitch").value = data.pitch;
  document.getElementById("description").value = data.description || "";
  document.getElementById("link").value = data.link || "";
  document.getElementById("icon_id").value = data.icon_id || "";
  document.getElementById("rotation").value = data.rotation;
  document.getElementById("radius").value = data.radius || "";
  document.getElementById("type_id").value = data.type_id;
  document.getElementById("width_px").value = data.width_px || "";
  document.getElementById("height_px").value = data.height_px || "";
}

/**
 * Guardar (POST si es nuevo / PUT si edita)
*/
async function saveInteraction(e) {
  e.preventDefault();

  const body = {
    id_interactions: document.getElementById("id_interactions").value || null,
    scene_id: document.getElementById("scene_id").value,
    title: document.getElementById("title").value,
    yaw: document.getElementById("yaw").value,
    pitch: document.getElementById("pitch").value,
    description: document.getElementById("description").value,
    link: document.getElementById("link").value,
    icon_id: document.getElementById("icon_id").value,
    rotation: document.getElementById("rotation").value,
    radius: document.getElementById("radius").value,
    type_id: document.getElementById("type_id").value,
    width_px: document.getElementById("width_px").value,
    height_px: document.getElementById("height_px").value
  };

  const method = body.id_interactions ? "PUT" : "POST";
  const url = body.id_interactions
    ? `/api/interactions/${body.id_interactions}`
    : `/api/interactions`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert("Guardado correctamente");
    window.location.href = "/admin";
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

