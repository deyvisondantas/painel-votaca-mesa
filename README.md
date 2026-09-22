# 🗳️ Painel de Votação — Câmara Municipal de Parnamirim

Sistema web para **gerenciamento e exibição de votações** da Câmara Municipal de Parnamirim.

O sistema possui duas interfaces: uma tela de **controle**, utilizada pelo operador para registrar e gerenciar os votos, e uma tela de **painel público**, destinada à exibição em TV, telão ou monitor.

As informações são atualizadas em **tempo real** entre as duas telas e os dados são persistidos no servidor.

---

## ✨ Funcionalidades

* 👥 **21 vereadores cadastrados**
* 🖥️ Tela de controle para lançamento dos votos
* 📺 Painel público para TV/telão
* ⚡ Atualização **em tempo real**
* 🗳️ Votação entre **Chapa 1**, **Chapa 2** e **Abstenção**
* 🟢 Voto na **Chapa 1**
* 🔵 Voto na **Chapa 2**
* 🟡 **Abstenção**
* ✏️ Alteração de voto
* 🧹 Limpeza de voto
* 🔢 Contagem automática
* 📊 Percentuais por opção de voto
* 📈 Gráfico visual dos resultados
* 🔢 Contador no formato **X / 21**
* 👤 Identificação dos vereadores que ainda não votaram
* 📋 Exibição dos vereadores que já votaram
* 🗳️ Exibição da opção escolhida por cada vereador
* ⚙️ Configuração do título da votação
* 🏷️ Configuração dos nomes das chapas
* 🆕 Botão para iniciar uma nova votação
* 💾 Persistência dos dados no servidor
* 🐳 Suporte a **Docker e Docker Compose**

---

## 🖥️ Interfaces

### 🎛️ Controle

A interface `/controle.html` é utilizada pelo operador responsável pelo gerenciamento da votação.

Por meio dela é possível:

* Registrar o voto de cada vereador;
* Selecionar **Chapa 1**;
* Selecionar **Chapa 2**;
* Registrar **Abstenção**;
* Alterar um voto já registrado;
* Limpar um voto;
* Acompanhar a quantidade de votos;
* Identificar quem ainda não votou;
* Configurar o título da votação;
* Alterar os nomes das chapas;
* Iniciar uma nova votação.

### 📺 Painel público

A interface `/painel.html` foi desenvolvida para exibição em:

* TVs;
* Monitores;
* Telões;
* Sessões legislativas.

O painel apresenta os resultados da votação em tempo real.

Além da contagem dos votos, o painel apresenta uma lista dos **vereadores que já votaram**.

Para cada vereador que já registrou seu voto, são exibidos:

* Nome;
* Opção escolhida.

Exemplo:

```text
VEREADORES QUE JÁ VOTARAM

Éder Queiroz — Chapa 1
Jonas Godeiro — Chapa 2
Rhalessa de Clênio — Abstenção
```

Os vereadores que ainda não registraram seus votos **não aparecem na lista de votantes**.

---

## ⚡ Atualização em tempo real

O sistema sincroniza as informações entre a tela de controle e o painel público.

```text
┌─────────────────────┐
│      CONTROLE       │
│                     │
│ Operador registra   │
│       o voto        │
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

Ao registrar, alterar ou limpar um voto, as informações do painel são atualizadas automaticamente.

---

## 🗳️ Opções de voto

Cada um dos 21 vereadores pode registrar uma das três opções:

* **Chapa 1**
* **Chapa 2**
* **Abstenção**

A **Abstenção** é contabilizada separadamente dos votos destinados às chapas.

---

## 📊 Contagem dos votos

O sistema realiza automaticamente a contagem das três opções:

```text
CHAPA 1       | CHAPA 2       | ABSTENÇÕES
     10        |      8        |      3
```

Também são apresentados os respectivos percentuais.

O andamento da votação é acompanhado pelo contador:

```text
15 / 21
```

indicando que 15 dos 21 vereadores já registraram seus votos.

---

## 👥 Vereadores que já votaram

O painel público possui uma seção específica:

> **VEREADORES QUE JÁ VOTARAM**

A lista é atualizada automaticamente conforme os votos são registrados.

Cada registro apresenta:

```text
Vereador — Voto
```

Exemplo:

```text
Éder Queiroz — Chapa 1
Jonas Godeiro — Chapa 2
Rhalessa de Clênio — Abstenção
```

Caso o vereador ainda não tenha votado, ele não é apresentado nessa lista.

---

## ⚙️ Configuração da votação

O operador pode configurar o título da votação e os nomes das chapas.

### Exemplo de título

```text
ELEIÇÃO DA MESA DIRETORA
```

### Exemplo de chapas

```text
Chapa 1: Renovação
Chapa 2: União
```

---

## ✏️ Alteração de voto

O sistema permite alterar o voto de um vereador.

Exemplo:

```text
Chapa 1 → Chapa 2
```

ou:

```text
Chapa 2 → Abstenção
```

A contagem e os percentuais são recalculados automaticamente.

---

## 🧹 Limpeza de voto

É possível limpar o voto de um vereador.

Ao limpar um voto:

* O vereador deixa de ser considerado votante;
* O voto é removido da contagem;
* Os percentuais são recalculados;
* O vereador deixa de aparecer na lista de quem já votou;
* O contador **X / 21** é atualizado.

---

## 🆕 Nova votação

O sistema possui um botão para **iniciar uma nova votação**.

Essa funcionalidade permite preparar o sistema para um novo processo de votação, limpando os registros anteriores e iniciando uma nova contagem.

---

# 🚀 Como executar

## 💻 Execução tradicional com Node.js

Depois de baixar o projeto, entre na pasta:

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

Depois acesse:

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

O projeto também pode ser executado utilizando **Docker e Docker Compose**.

Essa opção é recomendada para implantação em um servidor, pois permite executar a aplicação em um ambiente isolado e padronizado.

## 📋 Requisitos

É necessário ter instalado:

* Docker
* Docker Compose

Em versões atuais do Docker, o Compose é executado pelo comando:

```bash
docker compose
```

---

## 🏗️ Construindo e iniciando o sistema

Na raiz do projeto, onde está localizado o arquivo `docker-compose.yml`, execute:

```bash
docker compose up -d --build
```

O comando irá:

1. Construir a imagem da aplicação;
2. Criar o container;
3. Iniciar o servidor;
4. Disponibilizar a aplicação na porta `3000`.

---

## 🔎 Verificando o container

Para verificar se o container está em execução:

```bash
docker compose ps
```

Para visualizar os logs:

```bash
docker compose logs -f
```

---

## 🌐 Acessando com Docker

Após o container iniciar:

### 🎛️ Controle

```text
http://localhost:3000/controle.html
```

### 📺 Painel

```text
http://localhost:3000/painel.html
```

---

## 🔄 Atualizando a aplicação

Depois de alterar o código-fonte, reconstrua a imagem:

```bash
docker compose up -d --build
```

O Docker irá reconstruir a aplicação utilizando a versão atualizada do código.

---

## 🛑 Parando a aplicação

Para parar e remover o container:

```bash
docker compose down
```

---

## 📋 Visualizando os logs

Para acompanhar os logs em tempo real:

```bash
docker compose logs -f
```

Para sair da visualização dos logs:

```text
Ctrl + C
```

O container continuará funcionando.

---

## 🐳 Estrutura Docker

O projeto utiliza:

```text
Dockerfile
docker-compose.yml
.dockerignore
```

### Dockerfile

Responsável por definir como a imagem da aplicação será construída.

### docker-compose.yml

Responsável por definir o serviço, a imagem, as portas e as configurações do container.

### .dockerignore

Define arquivos e diretórios que não devem ser enviados para o contexto de construção da imagem, como:

```text
node_modules
.git
npm-debug.log
```

---

# 🏛️ Utilização na rede da Câmara

O servidor pode ser executado em um computador da rede da Câmara Municipal.

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
              │ votação         │
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

Por exemplo, se o servidor estiver no endereço:

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

> O endereço IP dependerá da configuração da rede onde o servidor estiver instalado.

---

## 💾 Persistência dos dados

Os dados da votação são persistidos no servidor.

Ao utilizar Docker, recomenda-se configurar um **volume** para os arquivos de dados da aplicação, garantindo que os dados não sejam perdidos caso o container seja recriado.

A configuração do volume dependerá da forma como o `server.js` realiza o armazenamento dos dados.

---

## 📁 Estrutura do projeto

```text
painel_votacao_camara/
│
├── controle.html
├── painel.html
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

## 🛠️ Tecnologias

* HTML5
* CSS3
* JavaScript
* Node.js
* NPM
* Docker
* Docker Compose
* Comunicação em tempo real
* Persistência de dados no servidor

---

## 🏛️ Desenvolvimento

Projeto desenvolvido para utilização no âmbito da:

**Câmara Municipal de Parnamirim — RN**

**Centro de Tecnologia da Informação — CTI**

> **Inovação que conecta. Tecnologia que resolve.**

---

## 📄 Licença

Este projeto foi desenvolvido para utilização institucional da Câmara Municipal de Parnamirim.

A utilização, alteração e distribuição do código devem observar as políticas e autorizações aplicáveis à instituição.
