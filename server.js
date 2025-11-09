// server.js
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
const DATA_FILE = path.join(__dirname, "data.json");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve o index.html

// Inicializa o ficheiro de dados
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

// 🔹 Endpoint principal: simula resposta de IA
app.post("/api/respond", (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.json({ reply: "Por favor, envie uma mensagem válida." });

  const responses = [
    "Interessante! Podes explicar mais sobre isso?",
    "Compreendo. Posso adaptar a resposta para ti.",
    "Isso parece importante. Vamos refletir juntos.",
    "Sou TECLA Adapta PRIME — a tua inteligência criativa local 🌍"
  ];
  const reply = responses[Math.floor(Math.random() * responses.length)];
  res.json({ reply });
});

// 🔹 Salva novo aprendizado
app.post("/api/save", (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ message: "Campos obrigatórios." });

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.push({ question, answer });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Aprendizado salvo com sucesso." });
});

// 🔹 Retorna dados simulados
app.get("/api/data", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor mock TECLA rodando em http://localhost:${PORT}`);
});
