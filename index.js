// index.js
import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// === Conexión a PostgreSQL (Render) con tus credenciales ===
const pool = new Pool({
  host: "dpg-d2qba16r433s73e4mmh0-a.oregon-postgres.render.com",
  database: "base_de_datos_m5si",
  user: "base_de_datos_m5si_user",
  password: "9dICQaPksuczg6oWgbSPQhmg8hFCtrRT",
  port: 5432,
  ssl: { rejectUnauthorized: false }, // Render requiere SSL
});

// ====== Endpoints ======

// Healthcheck simple
app.get("/api/saludo", (_req, res) => {
  res.json({
    ok: true,
    mensaje: "Hola Geo 🚀, tu API está en línea con Render",
    fecha: new Date().toISOString(),
  });
});

// GET: listar usuarios
app.get("/api/usuarios", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id_usuario, nombre, correo, password, fecha_reg FROM usuarios ORDER BY id_usuario ASC;"
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error("Error SELECT usuarios:", err);
    res.status(500).json({ ok: false, error: "Error consultando usuarios" });
  }
});

// POST: crear usuario
app.post("/api/usuarios", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password)
       VALUES ($1, $2, $3)
       RETURNING id_usuario, nombre, correo, password, fecha_reg;`,
      [nombre, correo, password]
    );
    res.status(201).json({ ok: true, usuario: rows[0] });
  } catch (err) {
    console.error("Error INSERT usuario:", err);
    // Útil cuando hay conflicto por correo UNIQUE:
    if (err.code === "23505") {
      return res.status(409).json({ ok: false, error: "correo_duplicado" });
    }
    res.status(500).json({ ok: false, error: "Error creando usuario" });
  }
});

// 404 controlado
app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "not_found" });
});

// Arranque
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
