const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");
const LOGO_FILE = path.join(__dirname, "public", "logo.png");

// Identificadores internos.
// NÃO representam números de gabinete e não são exibidos ao usuário.
const VEREADORES_PADRAO = [
  ["vereador01","Éder Queiroz"],["vereador02","Jonas Godeiro"],["vereador03","Rhalessa de Clênio"],
  ["vereador04","Wolney França"],["vereador05","Gabriel César"],["vereador06","Binho de Ambrósio"],
  ["vereador07","Thiago Fernandes"],["vereador08","Léo Lima"],["vereador09","Michael Diniz"],
  ["vereador10","Irani Guedes"],["vereador11","Chicão"],["vereador12","Carol Pires"],
  ["vereador13","Michael Borges"],["vereador14","Professor Ítalo"],["vereador15","Rafaela de Nilda"],
  ["vereador16","Professor Diego"],["vereador17","Rodrigo Cruz"],["vereador18","César Maia"],
  ["vereador19","Rárika Bastos"],["vereador20","Afrânio Bezerra"],["vereador21","Eurico da Japão"]
].map(([gabinete, nome]) => ({ gabinete, nome }))
 .sort((a,b) => a.nome.localeCompare(b.nome, "pt-BR"));

function normalizeVereadores(raw) {
  const entrada = Array.isArray(raw) ? raw : VEREADORES_PADRAO;
  const usados = new Set();

  const lista = entrada.map(v => {
    const gabinete = String(v?.gabinete || "").trim();
    const nome = String(v?.nome || "").trim();

    if (!gabinete || !nome || usados.has(gabinete)) return null;

    usados.add(gabinete);

    return { gabinete, nome };
  }).filter(Boolean);

  return lista.sort(
    (a,b) => a.nome.localeCompare(b.nome, "pt-BR")
  );
}


const CARGOS = [
  ["presidente", "Presidente"],
  ["vice1", "1º Vice-Presidente"],
  ["vice2", "2º Vice-Presidente"],
  ["secretario1", "1º Secretário"],
  ["secretario2", "2º Secretário"]
];

function defaultChapas() {
  return [1,2,3,4].map((n, i) => ({
    id: `chapa${n}`,
    nome: `Chapa ${n}`,
    ativa: i < 2,
    cargos: {
      presidente:"",
      vice1:"",
      vice2:"",
      secretario1:"",
      secretario2:""
    }
  }));
}

function initialState() {
  return {
    titulo: "VOTAÇÃO",
    subtitulo: "ELEIÇÃO DA MESA DIRETORA",
    chapas: defaultChapas(),
    vereadores: normalizeVereadores(),
    votos: {},
    ausentes: {},
    updatedAt: null,
    finalized: false,
    pdfSaved: false,
    finalizedAt: null
  };
}

function normalizeState(raw) {
  const base = initialState();

  if (!raw || typeof raw !== "object") return base;

  const incomingChapas = Array.isArray(raw.chapas)
    ? raw.chapas
    : [];

  const normalized = {
    ...base,

    vereadores: normalizeVereadores(raw.vereadores),

    ...raw,

    chapas: base.chapas.map((fallback, index) => {
      const incoming =
        incomingChapas.find(c => c && c.id === fallback.id) ||
        incomingChapas[index] ||
        {};

      return {
        ...fallback,
        ...incoming,

        id: fallback.id,

        nome:
          typeof incoming.nome === "string" &&
          incoming.nome.trim()
            ? incoming.nome.trim()
            : fallback.nome,

        ativa: Boolean(incoming.ativa),

        cargos: {
          ...fallback.cargos,
          ...(incoming.cargos || {})
        }
      };
    }),

    votos:
      raw.votos && typeof raw.votos === "object"
        ? raw.votos
        : {},

    ausentes:
      raw.ausentes && typeof raw.ausentes === "object"
        ? raw.ausentes
        : {},

    finalized: Boolean(raw.finalized),
    pdfSaved: Boolean(raw.pdfSaved),
    finalizedAt: raw.finalizedAt || null
  };

  // Migração da versão anterior
  if (!raw.chapas) {
    normalized.chapas[0].nome = raw.chapa1 || "Chapa 1";
    normalized.chapas[1].nome = raw.chapa2 || "Chapa 2";
  }

  return normalized;
}

function loadState() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return initialState();
    }

    return normalizeState(
      JSON.parse(
        fs.readFileSync(DATA_FILE, "utf8")
      )
    );
  } catch {
    return initialState();
  }
}

let state = loadState();

function saveState() {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(state, null, 2),
    "utf8"
  );
}

function listaVereadores() {
  return Array.isArray(state.vereadores)
    ? state.vereadores
    : VEREADORES_PADRAO;
}

function novoIdVereador() {
  return `vereador-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function activeChapas() {
  return state.chapas.filter(c => c.ativa);
}

function calculateResult() {
  const counts = {};

  activeChapas().forEach(c => {
    counts[c.id] = 0;
  });

  counts.abstencao = 0;

  Object.values(state.votos).forEach(voto => {
    if (counts[voto] !== undefined) {
      counts[voto]++;
    }
  });

  const chapasComVotos = activeChapas().map(chapa => ({
    id: chapa.id,
    nome: chapa.nome,
    votos: counts[chapa.id] || 0
  }));

  const maior = chapasComVotos.length
    ? Math.max(...chapasComVotos.map(c => c.votos))
    : 0;

  const lideres = chapasComVotos.filter(
    c => c.votos === maior
  );

  const totalVotos = Object.keys(state.votos).length;

  let status = "aguardando";
  let vencedora = null;

  if (state.finalized) {
    if (totalVotos === 0 || maior === 0) {
      status = "sem-vencedora";

    } else if (lideres.length === 1) {
      status = "vencedora";

      vencedora =
        state.chapas.find(
          c => c.id === lideres[0].id
        ) || null;

    } else {
      status = "empate";
    }
  }

  return {
    status,
    vencedora,
    empate: lideres.length > 1
      ? lideres
      : [],
    contagem: counts,
    totalVotos
  };
}

function publicState() {
  return {
    titulo: state.titulo,
    subtitulo: state.subtitulo,
    chapas: state.chapas,
    votos: state.votos,
    ausentes: state.ausentes,
    updatedAt: state.updatedAt,
    finalized: state.finalized,
    pdfSaved: state.pdfSaved,
    finalizedAt: state.finalizedAt,
    vereadores: listaVereadores(),
    resultado: calculateResult()
  };
}

function broadcast() {
  const msg = JSON.stringify({
    type:"state",
    data:publicState()
  });

  wss.clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) {
      c.send(msg);
    }
  });
}

const app = express();

app.use(
  express.json({
    limit:"1mb"
  })
);

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

app.get(
  "/api/state",
  (req,res) => res.json(publicState())
);

app.post("/api/voto", (req,res) => {

  if (state.finalized) {
    return res.status(409).json({
      error:"A votação já foi finalizada."
    });
  }

  const gabinete = String(req.body.gabinete);
  const voto = req.body.voto;

  if (
    !listaVereadores().some(
      v => v.gabinete === gabinete
    )
  ) {
    return res.status(400).json({
      error:"Vereador inválido."
    });
  }

  if (state.ausentes[gabinete]) {
    return res.status(400).json({
      error:"Este vereador está marcado como ausente."
    });
  }

  const valid = [
    ...activeChapas().map(c => c.id),
    "abstencao",
    null
  ];

  if (!valid.includes(voto)) {
    return res.status(400).json({
      error:"Opção de voto inválida."
    });
  }

  if (voto === null) {
    delete state.votos[gabinete];
  } else {
    state.votos[gabinete] = voto;
  }

  const presentes = listaVereadores()
    .filter(v => !state.ausentes[v.gabinete]);

  const votosRegistrados =
    Object.keys(state.votos).length;

  // Quando o último vereador presente vota,
  // a votação é encerrada automaticamente.
  if (votosRegistrados >= presentes.length) {

    state.finalized = true;
    state.pdfSaved = false;

    state.finalizedAt =
      new Date().toISOString();

    state.updatedAt =
      state.finalizedAt;

  } else {

    state.updatedAt =
      new Date().toISOString();
  }

  saveState();
  broadcast();

  res.json(publicState());
});

app.post("/api/ausente", (req,res) => {

  if (state.finalized) {
    return res.status(409).json({
      error:"A votação já foi finalizada."
    });
  }

  const gabinete =
    String(req.body.gabinete);

  const ausente =
    Boolean(req.body.ausente);

  if (
    !listaVereadores().some(
      v => v.gabinete === gabinete
    )
  ) {
    return res.status(400).json({
      error:"Vereador inválido."
    });
  }

  if (ausente) {

    state.ausentes[gabinete] = true;

    delete state.votos[gabinete];

  } else {

    delete state.ausentes[gabinete];

  }

  state.updatedAt =
    new Date().toISOString();

  saveState();
  broadcast();

  res.json(publicState());
});

app.post("/api/vereadores", (req,res) => {
  if (state.finalized) {
    return res.status(409).json({
      error:"A votação atual já foi finalizada."
    });
  }

  if (!Array.isArray(req.body.vereadores)) {
    return res.status(400).json({
      error:"Lista de vereadores inválida."
    });
  }

  if (req.body.vereadores.length < 1) {
    return res.status(400).json({
      error:"Cadastre pelo menos 1 vereador."
    });
  }

  const novos = req.body.vereadores.map(v => ({
    gabinete: String(v?.gabinete || "").trim() || novoIdVereador(),
    nome: String(v?.nome || "").trim()
  }));

  if (novos.some(v => !v.nome)) {
    return res.status(400).json({
      error:"Informe o nome de todos os vereadores."
    });
  }

  const ids = novos.map(v => v.gabinete);

  if (new Set(ids).size !== ids.length) {
    return res.status(400).json({
      error:"Existem identificadores internos duplicados."
    });
  }

  const nomes = novos.map(v => v.nome.toLocaleLowerCase("pt-BR"));
  if (new Set(nomes).size !== nomes.length) {
    return res.status(400).json({
      error:"Não é permitido cadastrar dois vereadores com o mesmo nome."
    });
  }

  const atuais = new Set(listaVereadores().map(v => v.gabinete));
  const novosIds = new Set(ids);

  // Não permite remover um vereador que já possui voto registrado.
  for (const gabinete of atuais) {
    if (!novosIds.has(gabinete) && state.votos[gabinete] !== undefined) {
      return res.status(400).json({
        error:"Não é possível remover um vereador que já possui voto registrado."
      });
    }
  }

  // Não permite remover vereador que esteja ocupando cargo em uma chapa.
  for (const chapa of state.chapas) {
    for (const [key, gabinete] of Object.entries(chapa.cargos || {})) {
      if (gabinete && atuais.has(gabinete) && !novosIds.has(gabinete)) {
        return res.status(400).json({
          error:`Não é possível remover o vereador selecionado porque ele está na composição da ${chapa.nome}.`
        });
      }
    }
  }

  state.vereadores = normalizeVereadores(novos);

  // Limpa referências de ausentes que não existem mais.
  const idsAtuais = new Set(state.vereadores.map(v => v.gabinete));
  for (const gabinete of Object.keys(state.ausentes || {})) {
    if (!idsAtuais.has(gabinete)) delete state.ausentes[gabinete];
  }

  state.updatedAt = new Date().toISOString();
  saveState();
  broadcast();

  res.json(publicState());
});


app.post("/api/config", (req,res) => {

  if (state.finalized) {
    return res.status(409).json({
      error:"A votação atual já foi finalizada."
    });
  }

  const {
    titulo,
    subtitulo,
    chapas
  } = req.body;

  if (
    typeof titulo === "string" &&
    titulo.trim()
  ) {
    state.titulo = titulo.trim();
  }

  if (typeof subtitulo === "string") {
    state.subtitulo =
      subtitulo.trim();
  }

  if (
    Array.isArray(chapas) &&
    chapas.length === 4
  ) {

    const ids = [
      "chapa1",
      "chapa2",
      "chapa3",
      "chapa4"
    ];

    state.chapas = ids.map(
      (id,index) => {

        const incoming =
          chapas.find(
            c => c.id === id
          ) || {};

        const cargos = {};

        for (const [key] of CARGOS) {

          const g =
            String(
              incoming.cargos?.[key] || ""
            );

          cargos[key] =
            listaVereadores().some(
              v => v.gabinete === g
            )
              ? g
              : "";
        }

        return {
          id,

          nome:
            typeof incoming.nome === "string" &&
            incoming.nome.trim()
              ? incoming.nome.trim()
              : `Chapa ${index+1}`,

          ativa:
            Boolean(incoming.ativa),

          cargos
        };
      }
    );
  }

  const ativas =
    state.chapas.filter(
      c => c.ativa
    );

  if (
    ativas.length < 1 ||
    ativas.length > 4
  ) {
    return res.status(400).json({
      error:"É necessário cadastrar de 1 a 4 chapas ativas."
    });
  }

  for (const chapa of ativas) {

    const cargos =
      CARGOS.map(
        ([key,label]) => [
          key,
          chapa.cargos?.[key],
          label
        ]
      );

    const faltantes =
      cargos
        .filter(([,g]) => !g)
        .map(([, ,label]) => label);

    if (faltantes.length) {
      return res.status(400).json({
        error:
          `Preencha todos os cargos da ${chapa.nome}: ${faltantes.join(", ")}.`
      });
    }

    const membros =
      cargos.map(
        ([,g]) => g
      );

    if (
      new Set(membros).size !==
      membros.length
    ) {
      return res.status(400).json({
        error:
          `Um vereador não pode ocupar dois cargos na mesma ${chapa.nome}.`
      });
    }
  }

  state.updatedAt =
    new Date().toISOString();

  saveState();
  broadcast();

  res.json(publicState());
});

app.post("/api/finalizar", (req,res) => {

  if (state.finalized) {
    return res.json(
      publicState()
    );
  }

  const presentes =
    listaVereadores()
      .filter(
        v => !state.ausentes[v.gabinete]
      );

  const total =
    Object.keys(state.votos).length;

  if (total < presentes.length) {

    return res.status(400).json({
      error:
        `Ainda existem ${presentes.length-total} vereador(es) presente(s) sem voto registrado.`
    });
  }

  state.finalized = true;
  state.pdfSaved = false;

  state.finalizedAt =
    new Date().toISOString();

  state.updatedAt =
    state.finalizedAt;

  saveState();
  broadcast();

  res.json(publicState());
});

app.post("/api/pdf-salvo", (req,res) => {

  if (!state.finalized) {
    return res.status(400).json({
      error:"A votação ainda não foi finalizada."
    });
  }

  state.pdfSaved = true;

  state.updatedAt =
    new Date().toISOString();

  saveState();
  broadcast();

  res.json(publicState());
});

app.post("/api/reset", (req,res) => {

  if (
    state.finalized &&
    !state.pdfSaved
  ) {
    return res.status(409).json({
      error:
        "É obrigatório baixar e confirmar o salvamento do PDF antes de iniciar uma nova votação."
    });
  }

  // Preserva a lista de vereadores e as chapas configuradas pelo operador.
  // O reset zera somente a votação: votos, ausências e resultado.
  const vereadoresAtuais = listaVereadores().map(v => ({
    gabinete: v.gabinete,
    nome: v.nome
  }));

  const chapasAtuais = Array.isArray(state.chapas)
    ? JSON.parse(JSON.stringify(state.chapas))
    : defaultChapas();

  state = initialState();
  state.vereadores = vereadoresAtuais;
  state.chapas = chapasAtuais;
  state.updatedAt = new Date().toISOString();

  saveState();
  broadcast();

  res.json(publicState());
});

function vereadorNome(gabinete) {

  return (
    listaVereadores().find(
      v => v.gabinete === gabinete
    )?.nome ||
    "Não informado"
  );
}

function voteLabel(voto) {

  if (voto === "abstencao") {
    return "Abstenção";
  }

  return (
    state.chapas.find(
      c => c.id === voto
    )?.nome ||
    voto ||
    "Sem voto"
  );
}

app.get("/api/relatorio.pdf", (req,res) => {

  if (!state.finalized) {
    return res.status(409).send(
      "A votação ainda não foi finalizada."
    );
  }

  const doc =
    new PDFDocument({
      size:"A4",
      margin:42
    });

  const filename =
    `resultado-votacao-${new Date().toISOString().slice(0,10)}.pdf`;

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );

  doc.pipe(res);

  if (fs.existsSync(LOGO_FILE)) {

    try {
      doc.image(
        LOGO_FILE,
        42,
        35,
        {
          fit:[65,65]
        }
      );
    } catch {}
  }

  doc
    .fontSize(17)
    .font("Helvetica-Bold")
    .text(
      "CÂMARA MUNICIPAL DE PARNAMIRIM",
      120,
      42
    );

  doc
    .fontSize(11)
    .font("Helvetica")
    .text(
      state.subtitulo || "",
      120,
      67
    );

  doc
    .moveTo(42,108)
    .lineTo(553,108)
    .stroke();

  doc.moveDown(2);

  doc
    .fontSize(19)
    .font("Helvetica-Bold")
    .text(
      state.titulo || "VOTAÇÃO"
    );

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#555")
    .text(
      `Votação finalizada em ${new Date(state.finalizedAt).toLocaleString("pt-BR")}`
    );

  doc
    .fillColor("#000")
    .moveDown();

  const counts = {};

  activeChapas().forEach(
    c => counts[c.id] = 0
  );

  counts.abstencao = 0;

  Object.values(state.votos).forEach(v => {

    if (counts[v] !== undefined) {
      counts[v]++;
    }

  });

  const total =
    Object.keys(state.votos).length;

  const presentes =
    listaVereadores()
      .filter(
        v => !state.ausentes[v.gabinete]
      );

  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text("RESULTADO FINAL");

  doc.moveDown(.5);

  activeChapas().forEach(c => {

    const pct =
      total
        ? (
            (counts[c.id] / total) *
            100
          ).toFixed(2)
        : "0.00";

    doc
      .fontSize(11)
      .font("Helvetica")
      .text(
        `${c.nome}: ${counts[c.id]} voto(s) — ${pct}%`
      );
  });

  const pctA =
    total
      ? (
          (counts.abstencao / total) *
          100
        ).toFixed(2)
      : "0.00";

  doc.text(
    `Abstenções: ${counts.abstencao} — ${pctA}%`
  );

  doc.text(
    `Presentes: ${presentes.length} / ${listaVereadores().length}`
  );

  doc.text(
    `Total de votos registrados: ${total} / ${presentes.length}`
  );

  doc.moveDown();

  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text("COMPOSIÇÃO DAS CHAPAS");

  doc.moveDown(.4);

  activeChapas().forEach(chapa => {

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(chapa.nome);

    doc
      .fontSize(10)
      .font("Helvetica");

    CARGOS.forEach(
      ([key,label]) => {

        const g =
          chapa.cargos?.[key];

        doc.text(
          `${label}: ${g ? vereadorNome(g) : "Não informado"}`
        );
      }
    );

    doc.moveDown(.5);
  });

  doc.addPage();

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(
      "REGISTRO INDIVIDUAL DOS VOTOS"
    );

  doc.moveDown();

  listaVereadores().forEach(
    (v,i) => {

      doc
        .fontSize(9.5)
        .font("Helvetica")
        .text(
          `${String(i+1).padStart(2,"0")}. ${v.nome} — ${state.ausentes[v.gabinete] ? "Ausente" : voteLabel(state.votos[v.gabinete])}`
        );
    }
  );

  doc.moveDown();

  doc
    .fontSize(9)
    .fillColor("#666")
    .text(
      "Documento gerado pelo Sistema de Votação. Este relatório registra o estado final da votação no momento da geração."
    );

  doc.end();
});

app.get(
  "/api/health",
  (req,res) =>
    res.json({
      ok:true,
      finalized:state.finalized
    })
);

const server =
  http.createServer(app);

const wss =
  new WebSocket.Server({
    server
  });

wss.on("connection", ws => {

  ws.send(
    JSON.stringify({
      type:"state",
      data:publicState()
    })
  );

});

server.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Controle: http://localhost:${PORT}/controle.html`
    );

    console.log(
      `Painel:   http://localhost:${PORT}/painel.html`
    );
  }
);