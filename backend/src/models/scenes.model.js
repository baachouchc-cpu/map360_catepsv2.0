const db = require('../services/db');

async function getAllScenesWithHotspots() {
  const query = `
   SELECT 
  s.id_scene,
  s.imagen_url,
  s.description AS scene_description,

  -- 🔹 Kind
  s.kind_id,
  k.name_kind,

  -- 🔹 Floor
  s.floor_id,
  f.name_floor,

  -- 🔹 Tower
  s.tower_id,
  t.name_tower,

  -- 🔹 Orientation
  s.orientation_id,
  o.name_orientation,
  h.hotspots,
  r.interactions
FROM scenes s
LEFT JOIN kind k ON s.kind_id = k.id_kind
LEFT JOIN floor f ON s.floor_id = f.id_floor
LEFT JOIN tower t ON s.tower_id = t.id_tower
LEFT JOIN orientation o ON s.orientation_id = o.id_orientation

-- Subquery para hotspots
LEFT JOIN (
    SELECT h.scene_id,
           json_agg(
             json_build_object(
               'id_hotspots', h.id_hotspots,
               'title', h.title,
               'yaw', h.yaw,
               'pitch', h.pitch,
               'description', h.description,
               'link_scene_id', h.link_scene_id,
               'icon_id', h.icon_id,
               'icon_url', i.icon_url,
               'name_icon', i.name_icon,
               'rotation', h.rotation
             )
           ) AS hotspots
    FROM hotspots h
    LEFT JOIN icons i ON h.icon_id = i.id_icon
    GROUP BY h.scene_id
) h ON s.id_scene = h.scene_id

-- Subquery para interactions
-- Subquery para interactions
LEFT JOIN (
    SELECT r.scene_id,
           json_agg(
             json_build_object(
               'id_interactions', r.id_interactions,
               'title', r.title,
               'yaw', r.yaw,
               'pitch', r.pitch,
               'description', r.description,
               'link', r.link,
               'icon_id', r.icon_id,
               'icon_url', rc.icon_url,
               'name_icon', rc.name_icon,
               'rotation', r.rotation,
               'radius', r.radius,
               'type', r.type_id,
               'type_name', c.name
             )
           ) AS interactions
    FROM interactions r
    LEFT JOIN itypes c ON c.id_type = r.type_id
    LEFT JOIN icons rc ON r.icon_id = rc.id_icon
    GROUP BY r.scene_id
) r ON s.id_scene = r.scene_id
 
ORDER BY s.id_scene ASC;
  `;

  const res = await db.query(query);
  return res.rows;
}

module.exports = { getAllScenesWithHotspots };
