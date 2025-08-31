// index.js
import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Conexión a PostgreSQL (Render te da DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// === Endpoints ===

// Probar que funciona
app.get("/api/saludo", (req, res) => {
  res.json({
    ok: true,
    mensaje: "Hola Geo 🚀, tu API está en línea con Render",
    fecha: new Date().toISOString(),
  });
});

// Obtener todos los usuarios
app.get("/api/usuarios", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios ORDER BY id_usuario ASC;");
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error consultando usuarios" });
  }
});

// Crear usuario
app.post("/api/usuarios", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password) 
       VALUES ($1, $2, $3) RETURNING *;`,
      [nombre, correo, password]
    );
    res.status(201).json({ ok: true, usuario: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error creando usuario" });
  }
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

