
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

function lerDados(callback) {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) return callback({});
    try {
      const json = JSON.parse(data || '{}');
      callback(json);
    } catch {
      callback({});
    }
  });
}

function salvarDados(dados, callback) {
  fs.writeFile('data.json', JSON.stringify(dados, null, 2), 'utf8', err => {
    if (err) return callback(err);
    callback(null);
  }
app.get('/data.json', (req, res) => {
  lerDados(dados => res.json(dados));
});

app.post('/save', (req, res) => {
  salvarDados(req.body, err => {
    if (err) return res.status(500).send('Erro ao salvar');
    res.send('OK');
  });
});

app.put('/update', (req, res) => {
  const { chave, resposta } = req.body;
  if (!chave || !resposta) return res.status(400).send('Chave e resposta são obrigatórias');

  lerDados(dados => {
    dados[chave] = resposta;
    salvarDados(dados, err => {
      if (err) return res.status(500).send('Erro ao atualizar');
      res.send('Atualizado com sucesso');
    });
  });
});

app.delete('/delete', (req, res) => {
  const { chave } = req.body;
  if (!chave) return res.status(400).send('Chave é obrigatória');

  lerDados(dados => {
    if (dados[chave]) {
      delete dados[chave];
      salvarDados(dados, err => {
        if (err) return res.status(500).send('Erro ao excluir');
        res.send('Excluído com sucesso');
      });
    } else {
      res.status(404).send('Chave não encontrada');
    }
  });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
