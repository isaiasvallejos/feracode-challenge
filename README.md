# Desafio – Feracode

![](https://img.shields.io/github/package-json/v/isaiasvallejos/feracode-challenge.svg) ![](https://img.shields.io/github/license/isaiasvallejos/feracode-challenge.svg) ![](https://img.shields.io/github/languages/top/isaiasvallejos/feracode-challenge.svg?&color=yellow)

Em produção em: https://fera.isaiasvallejos.dev

## Sumário

Esse repositório representa um desafio proposto pela empresa [Feracode](https://feracode.com/) e está sendo disponibilizado também como caso de estudo e portfolio.

## O que é?

Um projeto simples de gerenciamento de produtos e suas variantes (e.g. tamanho e/ou cor), especificamente aqui para uma loja de fraldas, mas pode-se aplicar para quaisquer tipos de produtos.
Todos os produtos possuem gerenciamento de estoque, compra e também possuem uma predição para quantidade de vendas.

#### Tecnologias

- [Node.js](https://nodejs.org) (>= v10)
  - [Express.js](https://expressjs.com) - framework web para API RESTs
  - [Ramda](https://ramdajs.com) - biblioteca para orquestração e composição de código funcional
  - [Winston](https://github.com/winstonjs/winston) - biblioteca para gerenciamento de logs
  - [Babel](https://babeljs.io/) - compilador de Javascript
  - [Mocha](https://mochajs.org/) com [Chai](https://www.chaijs.com/) - frameworks para criação e execução de testes
- [CouchDB](http://couchdb.apache.org/)

#### Dependências

- [Docker](https://www.docker.com/) com [Docker Compose](https://docs.docker.com/compose/)
- Makefile

## Instalação e execução

Recomenda-se a instalação da aplicação em cima de um ambiente Docker.

```sh
$ git clone https://github.com/isaiasvallejos/feracode-challenge
$ cd feracode-challenge
$ mv .env.example .env
$ make dev # npm run docker:dev
$ make migrate-up # npm run docker:migrate-up
```

**Atenção!** A migração pode falhar inicialmente caso o CouchDB demore para inicializar.

A partir disso será possível acessar o serviço, por padrão, no endereço `localhost:8080`.

## Comandos

É possível verificar todos os comandos dentro dos arquivos `Makefile` e `package.json`.

#### Testes

```sh
$ make tests # npm run docker:tests
```

#### Produção

```sh
$ make build # npm run docker:build
$ make start # npm run docker:start
```

#### Logs

```sh
$ make logs # npm run docker:logs
```
