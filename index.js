require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Entry = require("./models/Entry");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// ─── GET /api/entries ───────────────────────────────────────────────
// Trae todos los registros (ambos usuarios)
app.get("/api/entries", async (req, res) => {
  try {
    const entries = await Entry.find().sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/entries/:user ─────────────────────────────────────────
app.get("/api/entries/:user", async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.params.user }).sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/entries ──────────────────────────────────────────────
// Crea o reemplaza el registro de un usuario para una fecha
app.post("/api/entries", async (req, res) => {
  try {
    const { user, date, apps } = req.body;
    if (!user || !date || !apps?.length) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
    const total = apps.reduce((s, a) => s + (a.amount || 0), 0);

    const entry = await Entry.findOneAndUpdate(
      { user, date },
      { user, date, apps, total },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/entries/:id ────────────────────────────────────────
app.delete("/api/entries/:id", async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
