const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

const dataPath = path.join(__dirname, 'data.json');

app.get('/data.json', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.warn('⚠️ Nenhum arquivo de dados encontrado. Criando novo.');
      return res.json({});
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      console.error('Erro ao analisar JSON:', e);
      res.json({});
    }
  });
});

app.post('/save', (req, res) => {
  fs.writeFile(dataPath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Erro ao salvar:', err);
      return res.status(500).send('Erro ao salvar');
    }
    res.send('OK');
  });
});

function analisarSentimento(texto) {
  const t = texto.toLowerCase();
  if (t.includes("feliz") || t.includes("ótimo") || t.includes("bom") || t.includes("adoro")) return "happy";
  if (t.includes("triste") || t.includes("chorar") || t.includes("infeliz")) return "sad";
  if (t.includes("raiva") || t.includes("zangado") || t.includes("irritado")) return "angry";
  if (t.includes("ansioso") || t.includes("medo") || t.includes("nervoso")) return "anxious";
  if (t.includes("sono") || t.includes("cansado") || t.includes("exausto")) return "sleepy";
  if (t.includes("fome") || t.includes("comer")) return "hungry";
  if (t.includes("calmo") || t.includes("tranquilo") || t.includes("paz")) return "calm";
  return "neutral";
}

app.post('/emotion', (req, res) => {
  const { text } = req.body;
  const emotion = analisarSentimento(text || '');
  res.json({ emotion });
});


app.listen(PORT, () =>
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
);

