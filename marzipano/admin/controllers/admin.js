// admin.js
let isEditMode = false;
document.addEventListener("DOMContentLoaded", initAdmin);

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(r => r.startsWith(name + '='))
    ?.split('=')[1];
}

async function initAdmin() {
  await loadScenes();   // ⬅️ primero llena el select
  await loadType();     // ⬅️ luego llena el select de tipos
  await loadIcon();     // ⬅️ luego llena el select de iconos

  const params = new URLSearchParams(window.location.search);
  const interactionId = params.get("id_interaction");
  const typeSelect = document.getElementById("type_id");

  // ejecutarlo al cargar (modo edición)
  toggleFieldsByType();
  typeSelect.addEventListener("change", toggleFieldsByType);

  // Bind submit una sola vez
  document.getElementById("interactionForm").addEventListener("submit", saveInteraction);

  if (interactionId) {
    isEditMode = true;
    await loadInteraction(interactionId);
  } else {
    isEditMode = false;
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

// Cargar escenas para el select
async function loadScenes() {
  try {
    const res = await fetch("/api/scenes/names");
    if (!res.ok) return alert("Error cargando escenas");
    const scenes = await res.json();
    const select = document.getElementById("scene_id");

    scenes.forEach(scene => {
      const option = document.createElement("option");
      option.value = scene.id_scene;
      option.textContent = scene.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error(err);
  }
}

// Cargar tipos de interacción para el select
async function loadType() {
  try {
    const res = await fetch("/api/interactions/types");
    if (!res.ok) return alert("Error cargando tipos de interacción");
    const types = await res.json();
    const select = document.getElementById("type_id");

    types.forEach(type => {
      const option = document.createElement("option");
      option.value = type.id_type;
      option.textContent = type.name;
      select.appendChild(option);
    });

  } catch (err) {
    console.error(err);
  }
}

// Cargar tipos de iconos para el select
async function loadIcon() {
  try {
    const res = await fetch("/api/interactions/icons");
    if (!res.ok) return alert("Error cargando tipos de iconos");
    const icons = await res.json();
    const select = document.getElementById("icon_id");

    icons.forEach(icon => {
      const option = document.createElement("option");
      option.value = icon.id_icon;
      option.textContent = icon.name_icon;
      select.appendChild(option);
    });

  } catch (err) {
    console.error(err);
  }
}

// Función genérica para mostrar/ocultar campos y marcar como requeridos
function toggleField({ show, required, targets }) {
  targets.forEach(t => {
    const group = t.groupId ? document.getElementById(t.groupId) : null;
    const input = document.getElementById(t.inputId);
    const label = document.getElementById(t.labelId);

    if (group) group.style.display = show ? "block" : "none";
    else input.style.display = show ? "block" : "none";

    if (label) {
      label.style.display = show ? "block" : "none";
      label.innerHTML = required
        ? `${t.labelText}<span class="required">*</span>`
        : t.labelText;
    }

    // ⚠️ SOLO marcar required si show = true
    if (show && required) {
      input.required = true;
    }

    // ⚠️ SOLO limpiar si se oculta
    if (!show) {
      input.required = false;
      input.value = "";
    }
  });
}

// Mostrar/ocultar campos según el tipo seleccionado
function toggleFieldsByType() {
  const typeValue = document.getElementById("type_id").value;
  const isEdit = document.getElementById("id_interactions").value;

  // 🔐 CONTRASEÑA → tipo 6
  toggleField({
    show: typeValue == "6",
    required: typeValue == "6" && !isEdit, // Solo requerido si es nuevo (en edición no es obligatorio cambiarla)
    targets: [{
      groupId: "group_password",
      inputId: "password",
      labelId: "lbl_password",
      labelText: "Contraseña"
    }]
  });

  // 📺 PANTALLA → tipo 2
  toggleField({
    show: typeValue == "2",
    required: typeValue == "2",
    targets: [{
      groupId: "group_screen",
      inputId: "radius",
      labelId: "lbl_radius",
      labelText: "Radio"
    },
    {
      groupId: "group_screen",
      inputId: "width_px",
      labelId: "lbl_width",
      labelText: "Ancho (px)"
    },
    {
      groupId: "group_screen",
      inputId: "height_px",
      labelId: "lbl_height",
      labelText: "Alto (px)"
    }]
  });
  
   //Foto
  toggleField({
    show: true, // 👈 SIEMPRE visible
    required: typeValue == "2" || typeValue == "4" || typeValue == "6",
    targets: [{
      groupId: null,
      inputId: "link",
      labelId: "lbl_link",
      labelText: "Link"
    }]
  });
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
  document.getElementById("radius").value = data.radius;
  document.getElementById("type_id").value = data.type_id;
  document.getElementById("width_px").value = data.width_px || "";
  document.getElementById("height_px").value = data.height_px || "";
  document.getElementById("password").value = "";
  toggleFieldsByType();
  if (data.pass_word) {
    document.getElementById("passwordHint").textContent =
      "Dejar en blanco para mantener la contraseña actual";
  }
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
    height_px: document.getElementById("height_px").value,
    pass_word: document.getElementById("password").value || null
  };

  const isEditMode = !!body.id_interactions;
  const method = isEditMode ? "PUT" : "POST";
  //const method = body.id_interactions ? "PUT" : "POST";
  const url = isEditMode
    ? `/api/interactions/${body.id_interactions}`
    : `/api/interactions`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    //alert("Guardado correctamente");
    //window.location.href = "/admin";
    if (isEditMode) {
      alert("Actualización completada. Sesión cerrada. Por seguridad, por favor vuelva a iniciar sesión.");

      // 🔐 borrar sesión
      localStorage.removeItem("token");

      // 🔁 ir al login
      window.location.href = "/admin/login";

    } else {
      alert("Interacción creada correctamente");

      // 🧹 limpiar formulario para crear otra
      document.getElementById("interactionForm").reset();

      // 👇 volver a aplicar reglas visuales
      toggleFieldsByType();
    }
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

