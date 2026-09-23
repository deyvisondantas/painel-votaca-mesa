<<<<<<< HEAD
# Painel de Votação — Câmara Municipal

Sistema web para lançamento manual dos votos, painel público em tempo real, cadastro de 1 a 4 chapas, composição da Mesa Diretora e resultado final em PDF.

## Recursos

- 21 vereadores cadastrados.
- De 1 a 4 chapas.
- Abstenção.
- Nome personalizado para cada chapa.
- Cinco cargos por chapa:
  - Presidente
  - 1º Vice-Presidente
  - 2º Vice-Presidente
  - 1º Secretário
  - 2º Secretário
- Painel público atualizado em tempo real por WebSocket.
- Finalização somente após registrar os 21 votos.
- PDF com logo, resultado, composição das chapas e registro individual.
- Após finalizar, o sistema bloqueia alterações até o PDF ser baixado e confirmado como salvo.
- Aviso do navegador ao tentar fechar/recarregar a tela de controle antes da confirmação do PDF.

## Node
=======
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
>>>>>>> 966052a5d2d1faf8e1eb5d8732ffc59edbccecea

```bash
npm install
npm start
```

Controle: http://localhost:3000/controle.html

Painel: http://localhost:3000/painel.html

## Docker

```bash
docker build -t painel-votacao-camara .
docker run -d --name painel-votacao -p 3000:3000 -v "$(pwd)/data.json:/app/data.json" painel-votacao-camara
```

Se você já possui um `docker-compose.yml`, mantenha um volume para `/app/data.json`.

Exemplo:

```yaml
services:
  painel-votacao:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data.json:/app/data.json
    restart: unless-stopped
```

## Observação

O navegador não permite que uma página obrigue o usuário a escolher um local de arquivo nem impeça definitivamente o fechamento da aba. Por isso o sistema usa o aviso padrão `beforeunload` e, além disso, bloqueia uma nova votação enquanto o PDF não for confirmado como salvo.
