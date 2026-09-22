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

---

### 📺 Painel público

A interface `/painel.html` foi desenvolvida para exibição em:

* 📺 TVs;
* 🖥️ Monitores;
* 🎥 Telões;
* 🏛️ Sessões legislativas.

O painel apresenta os resultados da votação em tempo real.

Além da contagem dos votos, o painel apresenta uma lista dos **vereadores que já votaram**.

Para cada vereador que já registrou seu voto, são exibidas:

* Nome do vereador;
* Opção escolhida.

Exemplo:

```text
VEREADORES QUE JÁ VOTARAM

Gab. 02 — Éder Queiroz — Chapa 1
Gab. 03 — Jonas Godeiro — Chapa 2
Gab. 04 — Rhalessa de Clênio — Abstenção
```

Os vereadores que ainda não registraram seus votos **não aparecem na lista de votantes**.

---

## 🗳️ Opções de voto

Cada um dos 21 vereadores pode registrar uma das três opções:

### 🟢 Chapa 1

Voto destinado à Chapa 1.

### 🔵 Chapa 2

Voto destinado à Chapa 2.

### 🟡 Abstenção

Registra a abstenção do vereador, sendo contabilizada separadamente das duas chapas.

---

## 📊 Contagem dos votos

O sistema realiza automaticamente a contagem das três opções:

```text
CHAPA 1       | CHAPA 2       | ABSTENÇÕES
     10        |      8        |      3
```

Também são apresentados os respectivos percentuais.

O andamento da votação é acompanhado pelo contador:

```te
```
