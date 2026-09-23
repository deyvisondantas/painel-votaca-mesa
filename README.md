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
