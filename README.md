# 🗳️ Painel de Votação — Câmara Municipal de Parnamirim

Sistema web para **acompanhamento e exibição de votações**, desenvolvido para utilização no ambiente legislativo.

O painel permite registrar os votos dos vereadores, apresentar o resultado da votação e identificar como cada parlamentar votou.

## ✨ Funcionalidades

* 👥 Listagem dos vereadores
* 🟢 Voto **Sim**
* 🔴 Voto **Não**
* 🟡 **Abstenção**
* ⚪ Identificação dos vereadores que ainda não votaram
* 📊 Contagem automática dos votos
* 👤 Exibição de **quem votou**
* 📈 Exibição do resultado da votação
* 🔄 Atualização dinâmica do painel
* 🖥️ Interface adequada para telas e monitores
* 📱 Layout responsivo

## 🏛️ Vereadores

O sistema apresenta os vereadores participantes da votação, sem associação com números ou gabinetes.

Exemplo:

| Vereador(a)        |
| ------------------ |
| Éder Queiroz       |
| Jonas Godeiro      |
| Rhalessa de Clênio |
| Wolney França      |
| ...                |

A relação de vereadores pode ser alterada diretamente na configuração do sistema.

## 🗳️ Tipos de voto

Cada parlamentar pode registrar uma das seguintes opções:

* **Sim** — voto favorável
* **Não** — voto contrário
* **Abstenção** — não manifesta voto favorável ou contrário

O painel apresenta a quantidade de votos de cada categoria e identifica os respectivos vereadores.

## 🖥️ Interface

O sistema foi pensado para utilização em:

* Computadores
* Monitores institucionais
* TVs
* Painéis de exibição
* Projetores

A interface prioriza a visualização rápida das informações durante uma sessão legislativa.

## 🛠️ Tecnologias

* HTML5
* CSS3
* JavaScript

## 🚀 Executando o projeto

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/painel-votacao.git
```

Entre na pasta:

```bash
cd painel-votacao
```

Abra o arquivo `index.html` no navegador.

Durante o desenvolvimento, também é possível utilizar o **Live Server** no Visual Studio Code.

## 🌐 GitHub Pages

O projeto pode ser publicado gratuitamente utilizando o **GitHub Pages**.

No repositório:

1. Acesse **Settings**
2. Selecione **Pages**
3. Em **Build and deployment**, escolha **Deploy from a branch**
4. Selecione a branch `main`
5. Escolha a pasta `/root`
6. Clique em **Save**

## 📁 Estrutura do projeto

```text
painel-votacao/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── assets/
│   ├── imagens/
│   └── logos/
│
├── .gitignore
└── README.md
```

## 🔒 Observações

Este projeto é destinado à **visualização e gerenciamento de informações de votação** em ambiente institucional.

Para utilização em produção, recomenda-se implementar autenticação, controle de acesso, registro de alterações e armazenamento seguro dos dados.

## 🏛️ Desenvolvimento

Projeto desenvolvido no âmbito do **Centro de Tecnologia da Informação — CTI** da Câmara Municipal de Parnamirim.

**Câmara Municipal de Parnamirim — RN**

> Tecnologia a serviço do Legislativo.
