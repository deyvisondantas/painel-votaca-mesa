# 🗳️ Painel de Votação — Câmara Municipal de Parnamirim

Sistema web para **gerenciamento, realização, apuração e exibição de votações** da Câmara Municipal de Parnamirim — RN.

O sistema possui duas interfaces:

- 🎛️ **Controle** — utilizada pelo operador para configurar a votação, cadastrar as chapas, controlar a presença dos vereadores e registrar os votos.
- 📺 **Painel público** — destinado à exibição em TV, telão ou monitor.

As informações são sincronizadas em **tempo real** entre as interfaces e os dados da votação são persistidos no servidor.

---

## ✨ Funcionalidades

### 👥 Vereadores

- Cadastro de quantidade **variável de vereadores**.
- Adição, edição e remoção de vereadores pela interface de controle.
- Exibição dos vereadores em **ordem alfabética**.
- Marcação de vereador como **presente**.
- Marcação de vereador como **ausente**.
- Alteração do status de presença.
- Vereadores ausentes não podem votar.
- A votação considera somente os vereadores presentes.
- Contador baseado na quantidade de presentes.

### 🗳️ Chapas

O sistema permite cadastrar **de 1 a 4 chapas** por votação. Para uma chapa ser considerada válida, os cinco cargos precisam estar preenchidos com vereadores diferentes.

Cada chapa possui:

- Presidente
- 1º Vice-Presidente
- 2º Vice-Presidente
- 1º Secretário
- 2º Secretário

O sistema permite:

- Definir o nome de cada chapa.
- Ativar de 2 a 4 chapas.
- Selecionar os vereadores para cada cargo.
- Validar o preenchimento da composição.
- Impedir que o mesmo vereador ocupe dois cargos dentro da mesma chapa.

### 🔄 Preservação das configurações entre votações

Ao iniciar uma nova votação pelo comando de **zerar/iniciar nova votação**, o sistema limpa somente os dados da apuração atual:

- votos registrados;
- ausências;
- resultado da votação;
- estado de finalização.

As configurações cadastradas são preservadas para a próxima votação:

- lista de vereadores;
- nomes das chapas;
- quantidade de chapas configurada;
- composição dos cinco cargos de cada chapa;
- chapas ativas/inativas.

Isso permite realizar uma nova apuração sem precisar cadastrar novamente as chapas e seus integrantes.

### 🎛️ Controle da votação

- Configuração do título da votação.
- Cadastro e configuração de 1 a 4 chapas.
- Cadastro da composição da Mesa Diretora.
- Manutenção das chapas e de suas composições ao iniciar uma nova votação.
- Controle de presença e ausência.
- Registro dos votos.
- Alteração de voto.
- Limpeza de voto.
- Acompanhamento dos vereadores que já votaram.
- Identificação de quem ainda não votou.
- Contagem automática.
- Percentuais por chapa.
- Início de nova votação.

### 📺 Painel público

- Layout responsivo.
- Adaptação automática para 2, 3 ou 4 chapas.
- Exibição das chapas e seus resultados.
- Exibição da composição completa das chapas.
- Exibição dos vereadores que já votaram.
- Identificação dos vereadores ausentes.
- Contador de votação considerando somente os presentes.
- Atualização em tempo real.
- Exibição automática do resultado final.

### 🏆 Apuração automática

Quando **todos os vereadores presentes tiverem votado**, o sistema encerra automaticamente a votação e o painel apresenta o resultado.

Não é necessário que o operador clique em um botão de encerramento.

O sistema:

1. Identifica a quantidade de vereadores presentes.
2. Registra os votos.
3. Detecta quando todos os presentes votaram.
4. Encerra automaticamente a votação.
5. Calcula a quantidade de votos por chapa.
6. Calcula os percentuais.
7. Identifica a chapa com maior votação.
8. Exibe a chapa eleita no painel.
9. Exibe a composição completa da chapa eleita.

Em caso de empate, o sistema **não escolhe uma chapa arbitrariamente** e apresenta o empate no painel.

---

# 👥 Controle de presença

Os vereadores são apresentados em ordem alfabética.

Cada vereador pode ser marcado como:

```text
🟢 PRESENTE
🔴 AUSENTE
```

Exemplo:

```text
Ana Silva ............ PRESENTE
Carlos Souza ......... PRESENTE
João Santos .......... AUSENTE
José Oliveira ........ PRESENTE
Maria Pereira ........ PRESENTE
```

Vereadores marcados como ausentes:

- não podem registrar voto;
- não entram na quantidade de votantes;
- não são considerados no denominador dos percentuais;
- são identificados como ausentes no painel.

### Exemplo

```text
21 vereadores cadastrados
19 presentes
2 ausentes
```

A votação será realizada sobre os **19 vereadores presentes**.

O contador poderá apresentar:

```text
15 / 19
```

indicando que 15 dos 19 presentes já votaram.

---

# 🗳️ Processo de votação

A votação pode utilizar:

```text
1 chapa
```

ou:

```text
2 chapas
```

ou:

```text
3 chapas
```

ou:

```text
4 chapas
```

O sistema se adapta automaticamente à quantidade configurada.

Exemplo com três chapas:

```text
CHAPA 1 — RENOVAÇÃO
CHAPA 2 — UNIÃO
CHAPA 3 — EXPERIÊNCIA
```

Cada vereador presente registra o voto em uma das chapas disponíveis.

---

# 👥 Cadastro variável de vereadores

A quantidade de vereadores não é fixa no sistema. O operador pode cadastrar a quantidade necessária diretamente no painel de controle, sem alterar o código-fonte.

É possível:

- adicionar vereador;
- editar o nome;
- remover vereador, desde que ele não possua voto registrado e não esteja utilizado em uma chapa;
- manter a lista para as próximas votações.

Os identificadores utilizados internamente pelo sistema não são exibidos ao público.

Para uma chapa completa, é necessário haver pelo menos **5 vereadores cadastrados**, pois cada chapa possui cinco cargos distintos.

# 🏛️ Composição da Mesa Diretora

Cada chapa possui cinco cargos:

| Cargo | Vereador |
|---|---|
| Presidente | Vereador |
| 1º Vice-Presidente | Vereador |
| 2º Vice-Presidente | Vereador |
| 1º Secretário | Vereador |
| 2º Secretário | Vereador |

A composição é exibida no painel público.

Exemplo:

```text
CHAPA 1 — RENOVAÇÃO

Presidente          João Silva
1º Vice-Presidente  Maria Souza
2º Vice-Presidente  Carlos Lima
1º Secretário       Pedro Santos
2º Secretário       Ana Oliveira
```

---

# 📺 Painel público

A interface `/painel.html` foi desenvolvida para exibição em:

- TVs;
- Monitores;
- Telões;
- Sessões legislativas.

O painel é responsivo e organiza automaticamente as chapas conforme a quantidade cadastrada.

### 2 chapas

```text
┌──────────────────────┬──────────────────────┐
│       CHAPA 1        │       CHAPA 2        │
│       10 votos       │        8 votos       │
└──────────────────────┴──────────────────────┘
```

### 3 chapas

```text
┌───────────────┬───────────────┬───────────────┐
│    CHAPA 1    │    CHAPA 2    │    CHAPA 3    │
│    10 votos   │     6 votos   │     3 votos   │
└───────────────┴───────────────┴───────────────┘
```

### 4 chapas

```text
┌────────────┬────────────┬────────────┬────────────┐
│  CHAPA 1   │  CHAPA 2   │  CHAPA 3   │  CHAPA 4   │
│  8 votos   │  6 votos   │  3 votos   │  2 votos   │
└────────────┴────────────┴────────────┴────────────┘
```

---

# 👤 Vereadores que já votaram

O painel possui uma seção:

> **VEREADORES QUE JÁ VOTARAM**

Exemplo:

```text
Éder Queiroz — Chapa 1
Jonas Godeiro — Chapa 2
Rhalessa de Clênio — Chapa 1
```

Os vereadores que ainda não votaram não aparecem nessa lista.

---

# 🏆 Resultado automático

A votação é encerrada automaticamente quando todos os vereadores presentes tiverem registrado o voto.

### Exemplo

```text
21 vereadores cadastrados
19 presentes
19 votos registrados
```

Ao registrar o último voto, o painel muda automaticamente para o resultado.

Exemplo:

```text
🏆 CHAPA ELEITA

CHAPA 2 — UNIÃO

12 VOTOS — 63,16%

Presidente          João Silva
1º Vice-Presidente  Maria Souza
2º Vice-Presidente  Carlos Lima
1º Secretário       Pedro Santos
2º Secretário       Ana Oliveira
```

### Empate

Se duas ou mais chapas terminarem com a mesma quantidade de votos, o sistema apresenta:

```text
⚠️ EMPATE

CHAPA 1 — 9 votos
CHAPA 2 — 9 votos
CHAPA 3 — 1 voto

Não houve chapa vencedora nesta apuração.
```

O sistema não escolhe automaticamente uma chapa em situação de empate.

---

# ⚡ Atualização em tempo real

O sistema sincroniza as informações entre a tela de controle e o painel público.

```text
┌─────────────────────┐
│      CONTROLE       │
│                     │
│ Configura chapas    │
│ Controla presença   │
│ Registra os votos   │
└──────────┬──────────┘
           │
           │ Tempo real
           ↓
┌─────────────────────┐
│      SERVIDOR       │
│                     │
│ Armazena os dados   │
│ da votação          │
└──────────┬──────────┘
           │
           │ Tempo real
           ↓
┌─────────────────────┐
│  PAINEL PÚBLICO     │
│                     │
│     TV / TELÃO      │
└─────────────────────┘
```

Alterações de:

- presença;
- ausência;
- votos;
- chapas;
- resultados;

são refletidas no painel conforme a aplicação sincroniza os dados.

---

# ✏️ Alteração de voto

O operador pode alterar o voto de um vereador enquanto a votação estiver em andamento.

Exemplo:

```text
Chapa 1 → Chapa 2
```

A contagem e os percentuais são recalculados automaticamente.

---

# 🧹 Limpeza de voto

É possível limpar o voto de um vereador.

Ao limpar:

- o voto deixa de ser contabilizado;
- o vereador deixa de aparecer como votante;
- a contagem é recalculada;
- os percentuais são recalculados;
- o contador de votação é atualizado.

---

# 🆕 Nova votação

O sistema possui uma opção para iniciar uma nova votação.

Depois que o resultado em PDF for baixado e confirmado como salvo, o operador pode iniciar uma nova apuração. O sistema **preserva automaticamente as chapas e a lista de vereadores**, evitando recadastro a cada votação.

O operador pode:

1. Manter ou alterar o título da votação.
2. Utilizar de 1 a 4 chapas.
3. Manter ou alterar os nomes das chapas.
4. Manter ou alterar a composição da Mesa Diretora.
5. Manter a lista de vereadores cadastrada.
6. Definir os vereadores presentes.
7. Iniciar o novo processo de votação.

### O que é zerado

Ao iniciar uma nova votação, são zerados:

- votos da votação anterior;
- marcações de ausência;
- resultado/apuração;
- estado de finalização.

### O que é preservado

Permanecem configurados:

- vereadores cadastrados;
- nomes das chapas;
- quantidade de chapas;
- cargos e vereadores de cada chapa;
- situação ativa/inativa das chapas.

---

# ⚙️ Configuração da votação

### Exemplo de título

```text
ELEIÇÃO DA MESA DIRETORA
```

### Exemplo de chapas

```text
Chapa 1: Renovação
Chapa 2: União
Chapa 3: Experiência
```

---

# 🚀 Como executar

## 💻 Execução tradicional com Node.js

Entre na pasta do projeto:

```bash
cd painel_votacao_camara
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm start
```

Acesse:

### 🎛️ Controle

```text
http://localhost:3000/controle.html
```

### 📺 Painel

```text
http://localhost:3000/painel.html
```

---

# 🐳 Executando com Docker

O projeto possui suporte a Docker e Docker Compose.

## 📋 Requisitos

- Docker
- Docker Compose

Em versões atuais do Docker, utilize:

```bash
docker compose
```

## 🏗️ Construir e iniciar

Na raiz do projeto:

```bash
docker compose up -d --build
```

O comando irá:

1. Construir a imagem.
2. Criar o container.
3. Iniciar o servidor.
4. Disponibilizar a aplicação na porta `3000`.

## 🔎 Verificar o container

```bash
docker compose ps
```

## 📋 Ver logs

```bash
docker compose logs -f
```

## 🛑 Parar

```bash
docker compose down
```

## 🔄 Atualizar

Depois de atualizar o código:

```bash
git pull
docker compose up -d --build
```

---

# 🌐 Utilização na rede da Câmara

O servidor pode ser executado em um computador da rede da Câmara.

Exemplo:

```text
                 REDE DA CÂMARA
                       │
              ┌────────▼────────┐
              │  Computador CTI │
              │                 │
              │ Docker          │
              │                 │
              │ Servidor        │
              │ de votação      │
              └────────┬────────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
       ┌──────────────┐   ┌──────────────┐
       │ Computador   │   │   TV / Telão │
       │ do operador  │   │              │
       │              │   │ /painel.html │
       └──────────────┘   └──────────────┘
```

Se o servidor estiver, por exemplo, em:

```text
192.168.1.100
```

o operador poderá acessar:

```text
http://192.168.1.100:3000/controle.html
```

e a TV/telão:

```text
http://192.168.1.100:3000/painel.html
```

> O endereço IP depende da configuração da rede onde o servidor estiver instalado.

---

# 💾 Persistência dos dados

Os dados da votação são armazenados no servidor.

Em uma implantação Docker, recomenda-se utilizar um **volume** para os arquivos de dados da aplicação, garantindo que os dados não sejam perdidos quando o container for recriado.

A configuração do volume deve considerar a forma de persistência utilizada pelo `server.js`.

---

# 🐳 Estrutura Docker

O projeto utiliza:

```text
Dockerfile
docker-compose.yml
.dockerignore
```

### Dockerfile

Define como a imagem da aplicação é construída.

### docker-compose.yml

Define o serviço da aplicação, realiza o build da imagem e configura a execução do container.

### .dockerignore

Evita enviar arquivos desnecessários para o contexto do Docker, como:

```text
node_modules
.git
npm-debug.log
```

---

# 📁 Estrutura do projeto

```text
painel_votacao_camara/
│
├── public/
│   ├── controle.html
│   ├── painel.html
│   ├── css/
│   └── js/
│
├── server.js
│
├── package.json
├── package-lock.json
│
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
│
└── README.md
```

---

# 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript
- Node.js
- NPM
- Docker
- Docker Compose
- Comunicação em tempo real
- Persistência de dados no servidor

---

# 🏛️ Desenvolvimento

Projeto desenvolvido para utilização no âmbito da:

**Câmara Municipal de Parnamirim — RN**

**Centro de Tecnologia da Informação — CTI**

> **Inovação que conecta. Tecnologia que resolve.**

---

# 📄 Licença

Este projeto foi desenvolvido para utilização institucional da Câmara Municipal de Parnamirim.

A utilização, alteração e distribuição do código devem observar as políticas e autorizações aplicáveis à instituição.