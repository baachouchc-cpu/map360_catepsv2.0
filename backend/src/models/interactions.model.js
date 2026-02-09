// src/models/interactions.model.js  
const pool = require("../services/db");

const Interactions = {

  upsert: async (data) => {
    const {
      id_interactions,
      scene_id,
      title,
      yaw,
      pitch,
      description,
      link,
      icon_id,
      rotation,
      radius,
      type_id,
      width_px,
      height_px
    } = data;
    // If an id is provided we perform an upsert using ON CONFLICT on that id.
    // If no id is provided we insert without the id column so the DB can
    // assign it (avoids inserting NULL into a NOT NULL serial/identity column).
    if (id_interactions) {
      const query = `
        INSERT INTO interactions (
          id_interactions,
          scene_id,
          title,
          yaw,
          pitch,
          description,
          link,
          icon_id,
          rotation,
          radius,
          type_id,
          width_px,
          height_px
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        ON CONFLICT (id_interactions)
        DO UPDATE SET
          scene_id   = EXCLUDED.scene_id,
          title      = EXCLUDED.title,
          yaw        = EXCLUDED.yaw,
          pitch      = EXCLUDED.pitch,
          description= EXCLUDED.description,
          link       = EXCLUDED.link,
          icon_id    = EXCLUDED.icon_id,
          rotation   = EXCLUDED.rotation,
          radius     = EXCLUDED.radius,
          type_id    = EXCLUDED.type_id,
          width_px   = EXCLUDED.width_px,
          height_px  = EXCLUDED.height_px
        RETURNING *;
      `;

      const values = [
        id_interactions,
        scene_id,
        title,
        yaw,
        pitch,
        description || null,
        link || null,
        icon_id || null,
        rotation,
        radius || null,
        type_id,
        width_px || null,
        height_px || null
      ];

      const { rows } = await pool.query(query, values);
      return rows[0];
    }

    // No id provided: insert and let the DB generate the id
    const insertQuery = `
      INSERT INTO interactions (
        scene_id,
        title,
        yaw,
        pitch,
        description,
        link,
        icon_id,
        rotation,
        radius,
        type_id,
        width_px,
        height_px
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *;
    `;

    const insertValues = [
      scene_id,
      title,
      yaw,
      pitch,
      description || null,
      link || null,
      icon_id || null,
      rotation,
      radius || null,
      type_id,
      width_px || null,
      height_px || null
    ];

    const { rows } = await pool.query(insertQuery, insertValues);
    return rows[0];
  }

};

module.exports = Interactions;