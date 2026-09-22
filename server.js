const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");

const vereadores = [
  ["02","Éder Queiroz"],["03","Jonas Godeiro"],["04","Rhalessa de Clênio"],
  ["05","Wolney França"],["06","Gabriel César"],["07","Binho de Ambrósio"],
  ["08","Thiago Fernandes"],["09","Léo Lima"],["10","Michael Diniz"],
  ["11","Irani Guedes"],["12","Chicão"],["13","Carol Pires"],
  ["14","Michael Borges"],["15","Professor Ítalo"],["16","Rafaela de Nilda"],
  ["17","Professor Diego"],["18","Rodrigo Cruz"],["19","César Maia"],
  ["20","Rárika Bastos"],["21","Afrânio Bezerra"],["22","Eurico da Japão"]
].map(([gabinete,nome]) => ({gabinete,nome}));

function initialState() {
  return {
    titulo: "VOTAÇÃO",
    subtitulo: "ELEIÇÃO DA MESA DIRETORA",
    chapa1: "Chapa 1",
    chapa2: "Chapa 2",
    votos: {},
    updatedAt: null
  };
}
function loadState() {
  try { return fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE,"utf8")) : initialState(); }
  catch { return initialState(); }
}
let state = loadState();
function saveState(){ fs.writeFileSync(DATA_FILE, JSON.stringify(state,null,2),"utf8"); }
function publicState(){ return {...state, vereadores}; }

const app=express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.get("/api/state",(req,res)=>res.json(publicState()));

const server=http.createServer(app);
const wss=new WebSocket.Server({server});
function broadcast(){
  const msg=JSON.stringify({type:"state",data:publicState()});
  wss.clients.forEach(c=>{if(c.readyState===WebSocket.OPEN)c.send(msg);});
}
wss.on("connection",ws=>ws.send(JSON.stringify({type:"state",data:publicState()})));

app.post("/api/voto",(req,res)=>{
  const {gabinete,voto}=req.body;
  if(!vereadores.some(v=>v.gabinete===String(gabinete))) return res.status(400).json({error:"Vereador inválido."});
  if(!["chapa1","chapa2","abstencao",null].includes(voto)) return res.status(400).json({error:"Voto inválido."});
  if(voto===null) delete state.votos[String(gabinete)];
  else state.votos[String(gabinete)]=voto;
  state.updatedAt=new Date().toISOString();
  saveState(); broadcast(); res.json(publicState());
});
app.post("/api/reset",(req,res)=>{
  state=initialState(); saveState(); broadcast(); res.json(publicState());
});
app.post("/api/config",(req,res)=>{
  const {titulo,subtitulo,chapa1,chapa2}=req.body;
  if(typeof titulo==="string"&&titulo.trim()) state.titulo=titulo.trim();
  if(typeof subtitulo==="string") state.subtitulo=subtitulo.trim();
  if(typeof chapa1==="string"&&chapa1.trim()) state.chapa1=chapa1.trim();
  if(typeof chapa2==="string"&&chapa2.trim()) state.chapa2=chapa2.trim();
  state.updatedAt=new Date().toISOString(); saveState(); broadcast(); res.json(publicState());
});
server.listen(PORT,"0.0.0.0",()=>console.log(`Votação: http://localhost:${PORT}/controle.html | Painel: http://localhost:${PORT}/painel.html`));