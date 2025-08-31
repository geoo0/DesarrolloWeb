import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: "dpg-d2qba16r433s73e4mmh0-a.oregon-postgres.render.com",
  port: 5432,
  user: "base_de_datos_m5si",    
  password: "base_de_datos_m5si_user", 
  database: "base_de_datos_m5si_user",  
  ssl: { rejectUnauthorized: false }, 
});


app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error consultando la base de datos");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
