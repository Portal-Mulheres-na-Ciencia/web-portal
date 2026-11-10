# 🌐 Portal Mulheres na Ciência - Front-end (Angular)

Aplicação front-end do **Portal Mulheres na Ciência**, desenvolvida com Angular.

## 📋 Sobre o Projeto

O Portal Mulheres na Ciência reúne informações sobre cientistas brasileiras e internacionais, dando visibilidade às suas trajetórias e contribuições nas áreas de STEM (Ciência, Tecnologia, Engenharia e Matemática).

### Funcionalidades

- **Catálogo de Cientistas:** cards com todas as cientistas cadastradas.
- **Perfil da Cientista:** biografia, áreas de atuação, contribuições e prêmios.
- **Busca e Filtro:** pesquisa por nome ou instituição e filtro por área científica.
- **Linha do Tempo:** marcos de cada cientista em ordem cronológica.
- **Cientista do Dia:** destaque diário de uma cientista na página inicial.
- **Sugerir cientista:** formulário que grava a sugestão no banco pela API.

Os dados vêm da API do back-end ([api-portal](https://github.com/Portal-Mulheres-na-Ciencia/api-portal)).
O arquivo `src/app/services/dados-exemplo.ts` é usado só nos testes automáticos.

## 🛠️ Tecnologias

- [Angular](https://angular.dev/) 22 e [Angular Material](https://material.angular.dev/) 22
- TypeScript, HTML e CSS
- [Vitest](https://vitest.dev/) para os testes

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) **22.22.3 ou mais novo** (recomendado: Node 24 LTS). Confira com `node -v`.

### Jeito mais fácil: Docker (site + API + banco)

Com o Docker instalado e os repositórios `api-portal` e `web-portal` na mesma pasta:

```bash
cd api-portal
docker compose up --build
```

Acesse `http://localhost:4200`. Detalhes em `docs/AMBIENTE.md` do `api-portal`.

### Desenvolvimento (só o site)

```bash
git clone https://github.com/Portal-Mulheres-na-Ciencia/web-portal.git
cd web-portal
npm install
npm start
```

Acesse `http://localhost:4200`. O `npm start` encaminha as chamadas `/api/...` para a API em
`http://localhost:8080` (arquivo `proxy.conf.json`), então a API precisa estar rodando
(veja o README do `api-portal`). Sem a API, as páginas mostram o aviso "Não foi possível carregar os dados".

### Comandos úteis

| Comando | O que faz |
|---|---|
| `npm start` | Servidor de desenvolvimento |
| `npm test` | Testes unitários |
| `npm run build` | Build de produção em `dist/` |
| `docker build -t portal-site .` | Imagem do site (Angular + nginx) |

## 🎨 Design System

### Cores

O tema fica em `src/material-theme.scss` e usa o Material 3 (`--mat-sys-*`).

| Papel | Paleta | Uso |
|---|---|---|
| Primária | Rose | Identidade do projeto, botões e links principais |
| Terciária | Violet | Destaques e prêmios (não confundir com erro) |
| Erro | `--mat-sys-error` | Mensagens de erro |
| Sucesso, alerta, informação | `--cor-sucesso`, `--cor-alerta`, `--cor-info` | Definidas em `src/styles.css` |

A página `/cores` mostra todas as cores do tema, para consulta durante o desenvolvimento.

### Tipografia

- **Fraunces** (serifada): nomes e títulos. Token `--fonte-titulo`.
- **Inter**: texto e interface. Token `--fonte-texto`.

### Tokens e padrões globais (`src/styles.css`)

- Espaçamento em escala de 4 px: `--esp-1` (4 px) até `--esp-8` (64 px).
- Bordas: `--raio-p`, `--raio-m`, `--raio-total` e `--borda`.
- Layout: `--largura-conteudo` (1200 px), `--largura-leitura` (68 caracteres) e a classe `.container`.
- Classes compartilhadas: `.grade-cards`, `.titulo-pagina`, `.titulo-secao`, `.sobretitulo`, `.texto-apoio`, `.sr-only` e `.skeleton`.
- Foco visível em todos os elementos e animações desligadas para quem prefere menos movimento.

Use sempre os tokens em vez de valores soltos (cores, espaçamentos, fontes). Isso mantém o visual consistente e respeita o limite de 4 kB de CSS por componente.

### Componentes compartilhados (`src/app/components/compartilhado/`)

| Componente | Uso |
|---|---|
| `app-cabecalho` | Marca, navegação principal e link "Pular para o conteúdo" |
| `app-card-cientista` | Resumo da cientista; o card inteiro leva ao perfil |
| `app-monograma` | Iniciais da cientista, no lugar de fotos |
| `app-estado-vazio` | Lista vazia, busca sem resultado ou conteúdo não encontrado |
| `app-erro-carregamento` | Aviso quando a API não responde, com o botão "Tentar novamente" |

### Acessibilidade

- Navegação completa pelo teclado, com foco visível.
- Página atual marcada no menu (`aria-current`) e título próprio em cada aba.
- Informações nunca dependem só da cor (sempre há ícone ou texto junto).

## 🗂️ Estrutura

```
src/app/
├── components/
│   ├── compartilhado/   componentes reutilizáveis
│   ├── home/            página inicial
│   ├── catalogo/        catálogo com busca e filtros
│   ├── cientista/       perfil (hero, contribuição, premiação, linha do tempo)
│   ├── sugerir/         formulário "Sugerir cientista"
│   ├── nao-encontrado/  página 404
│   ├── paleta-cores/    referência das cores do tema (/cores)
│   └── rodape/
├── core/                modelos de dados
├── services/            chamadas à API (cientistas, áreas, sugestões)
└── util/                funções auxiliares
```

## 🌳 Estratégia de Branches

| Branch | Finalidade |
|---|---|
| `main` | Versão estável e final (entrega) |
| `develop` | Branch de integração da equipe |
| `feature/*` | Desenvolvimento de novas funcionalidades |
| `bugfix/*` | Correção de bugs |

> ⚠️ **Regra:** Nunca faça push direto na `main` ou `develop`. Sempre abra um Pull Request!

## 👩‍💻 Equipe

Arthur Vieira, Cleber Borges, Davi Vinicius, Enzo Theodoro, Guilherme Rodrigues, Jonathan Santos.
