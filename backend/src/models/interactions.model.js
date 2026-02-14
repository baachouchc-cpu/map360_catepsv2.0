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
      height_px,
      pass_word
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
          height_px,
          pass_word
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,CASE 
        WHEN $14::text IS NULL OR $14::text = '' THEN NULL
          ELSE crypt($14::text, gen_salt('bf', 10))
        END)
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
          height_px  = EXCLUDED.height_px,
          pass_word  = COALESCE(EXCLUDED.pass_word, interactions.pass_word)
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
        height_px || null,
        pass_word || null 
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
        height_px,
        pass_word
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,CASE 
      WHEN $13::text IS NULL OR $13::text = '' THEN NULL
        ELSE crypt($13::text, gen_salt('bf', 10))
      END)
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
      height_px || null,
      pass_word || null
    ];

    const { rows } = await pool.query(insertQuery, insertValues);
    return rows[0];
  }

};

module.exports = Interactions;