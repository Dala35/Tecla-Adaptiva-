const express=require('express');
const fs=require('fs');
const app=express();
const PORT=3000;

app.use(express.json());
app.use(express.static('.'));

app.get('/data.json',(req,res)=>{
  fs.readFile('data.json','utf8',(err,data)=>{
    if(err) return res.json({});
    try{res.json(JSON.parse(data));}catch{res.json({});}
  });
});

app.post('/save',(req,res)=>{
  fs.writeFile('data.json',JSON.stringify(req.body,null,2),'utf8',err=>{
    if(err) return res.status(500).send('Erro ao salvar');
    res.send('OK');
  });
});

app.listen(PORT,()=>console.log(`Servidor rodando em http://localhost:${PORT}`));
