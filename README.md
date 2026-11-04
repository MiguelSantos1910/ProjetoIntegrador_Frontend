# Easy Asset — Frontend

Painel web do Easy Asset, o sistema de gestão de laboratórios e ativos do Projeto Integrador IV (ADS, SENAI Roberto Mange). Feito com **Vue 3, Vite, Pinia e Tailwind CSS**, consome a API REST do [back-end Django](https://github.com/MiguelSantos1910/ProjetoIntegrador_Backend), a mesma usada pelo aplicativo mobile em Flutter.

O painel é o ambiente de administração: cadastro e consulta de ativos, inativação, ordens de manutenção, histórico, relatórios, perfis de usuário, auditoria e backup do banco. Ele não guarda regras de negócio nem acessa o banco: tudo passa pela API, que é quem decide as permissões.

## Sumário

- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Páginas e rotas](#páginas-e-rotas)
- [Papéis e permissões no painel](#papéis-e-permissões-no-painel)
- [Arquitetura](#arquitetura)
- [Integração com a API](#integração-com-a-api)
- [Executando localmente](#executando-localmente)
- [Usuários de teste](#usuários-de-teste)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Qualidade e CI](#qualidade-e-ci)
- [Aplicativo mobile e Realidade Aumentada](#aplicativo-mobile-e-realidade-aumentada)
- [Limitações conhecidas](#limitações-conhecidas)
- [Créditos e licenças](#créditos-e-licenças)
- [Repositórios](#repositórios)

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Vue 3 | Interface baseada em componentes |
| Vite | Ambiente de desenvolvimento e build |
| Vue Router | Rotas, com controle de acesso por papel |
| Pinia | Estado compartilhado (stores por módulo) |
| Axios | Comunicação HTTP com a API, com o token JWT |
| Tailwind CSS | Estilização (junto com um CSS por página em `src/assets/css/`) |
| Chart.js e vue-chartjs | Gráficos do Dashboard e de Relatórios |
| jsPDF e jspdf-autotable | Exportação de relatórios em PDF |
| qrcode.vue | QR Code do ativo na tela de detalhe |
| Lucide | Ícones |

## Funcionalidades

### Dashboard
Indicadores de ativos (total, disponíveis, em manutenção e inativos), gráficos por tipo e histórico recente das movimentações.

### Ativos
- Lista com busca por **nome, patrimônio, tipo, sala ou código do QR Code** e filtros de tipo, sala e status. Os inativos ficam ocultos por padrão; o filtro de status permite mostrá-los.
- Cadastro, edição e **inativação**. Ativos não são excluídos, para preservar o histórico. Na edição, o status "Inativo" permite reativar.
- Detalhe do ativo com o **QR Code** (o mesmo lido pelo app) e o **histórico de movimentações**: cadastro, manutenção, devolução, inativação, reativação e retorno ao uso.
- Exportação da lista em PDF.

### Manutenção
- Abertura de ordens de manutenção para um ativo, com responsável, custo estimado e status (`Pendente`, `Em andamento`, `Concluída` e `Cancelada`).
- Detalhe da ordem com os **logs** de criação e de mudança de status.
- **Cancelar ordem** no lugar de excluir: a ordem fica no histórico com o status `Cancelada`.

### Relatórios
Indicadores, gráficos, tabelas de ordens e de usuários com filtros, histórico das ordens e exportação em PDF. A exportação é feita no navegador, com os dados carregados.

### Categorias
Consulta dos tipos de ativo (Gabinete, Monitor, Teclado e Mesa) e da quantidade de ativos de cada tipo. Os tipos são fixos no back-end (ver [Limitações](#limitações-conhecidas)).

### Perfis e auditoria (professor)
- Gerenciamento de usuários e dos papéis (`PROFESSOR`, `SUPORTE` e `ALUNO`).
- Aba **Auditoria**, com os eventos de cadastro, login, falha, bloqueio, logout e backup, e filtros por usuário e evento.

### Backup do banco (professor)
Tela `/backups` para gerar backups e restaurar o sistema a partir deles. Antes de restaurar, o estado atual é salvo automaticamente; ao final, a sessão é encerrada. As ações aparecem na Auditoria. Detalhes em [`docs/backup.md`](https://github.com/MiguelSantos1910/ProjetoIntegrador_Backend/blob/main/docs/backup.md) do back-end.

### Login, cadastro e configurações
- Login com JWT. Depois de 5 tentativas erradas, a tela mostra o bloqueio e o tempo restante.
- Cadastro público, que sempre cria um `ALUNO`. O professor muda o papel em Perfis.
- Botão **Sair**, que invalida a sessão no back-end.
- **Configurações:** troca da própria senha (todos os papéis) e preferências da interface, salvas no navegador. Nome e e-mail só são editáveis pelo professor; para aluno e suporte ficam somente leitura.

## Páginas e rotas

| Rota | Página | Papéis |
|---|---|---|
| `/login` | `Login.vue` | público |
| `/cadastro` | `CadastroUsuario.vue` | público |
| `/dashboard` | `Dashboard.vue` | todos |
| `/ativos` | `Ativos.vue` | todos |
| `/ativos/novo` | `CadastroAtivos.vue` | professor e suporte |
| `/ativos/detalhe/:id` | `DetalheAtivo.vue` | todos (somente leitura para o aluno) |
| `/ativos/editar/:id` | `EditarAtivo.vue` | professor e suporte |
| `/manutencao` | `Manutencao.vue` | professor e suporte |
| `/manutencao/detalhe/:id` | `DetalheManutencao.vue` | professor e suporte |
| `/relatorios` | `Relatorios.vue` | professor e suporte |
| `/categorias` | `Categorias.vue` | todos |
| `/categorias/nova` | `NovaCategoria.vue` | professor e suporte |
| `/perfis` | `GerenciamentoPerfil.vue` | professor |
| `/backups` | `BackupBanco.vue` | professor |
| `/configuracoes` | `Configuracoes.vue` | todos |

Sem login, qualquer rota protegida leva ao `/login`. Com login, uma rota fora do papel do usuário leva ao Dashboard.

## Papéis e permissões no painel

| Papel | O que vê e faz |
|---|---|
| `PROFESSOR` | Tudo: ativos (cadastrar, editar e inativar), manutenção, relatórios, categorias, perfis, auditoria e backup |
| `SUPORTE` | Ativos (cadastrar, editar e inativar), manutenção, relatórios e categorias. Não gerencia perfis nem backup |
| `ALUNO` | Somente consulta: dashboard, lista e detalhe de ativos, categorias e configurações |

O painel esconde menus, botões e rotas conforme o papel (`meta.roles` em `src/routes/index.js` e `Navbar.vue`). Isso é só conveniência: **a permissão real é verificada no back-end**, que responde `403` a qualquer operação não autorizada.

## Arquitetura

```text
 Views (src/views)          páginas, uma por rota
   │
   ├── Components           Table, Card, Form, ConfirmModal, Info, Chart, QrCode, Navbar
   ├── Composables          status (badges), formatData (datas), gerarPdf
   │
   ▼
 Stores Pinia (src/stores)  auth, ativos, historico, ordens, usuarios, logsUser, backups
   │
   ▼
 services/api.js            Axios: baseURL e token JWT em cada requisição
   │  HTTP / REST
   ▼
 API Django (back-end)      autenticação, permissões, regras de negócio e banco
```

- **Views** cuidam da tela e chamam as stores.
- **Stores** fazem as requisições, guardam os dados e os estados `carregando` e `erro`.
- **Composables** padronizam rótulos e cores de status (`STATUS_ATIVO`), datas (`dataFormatada` e `dataHoraFormatada`) e PDF.

## Integração com a API

A URL da API vem da variável `VITE_APP_API_URL` (ver [Configurar a API](#3-configurar-a-api)). O `services/api.js` envia `Authorization: Bearer <token>` em toda requisição.

| Operação | Método | Endpoint |
|---|---|---|
| Login e renovação | `POST` | `/api/token/` e `/api/token/refresh/` |
| Logout | `POST` | `/api/contas/logout/` |
| Usuário autenticado | `GET` | `/api/contas/me/` |
| Usuários, papéis e senha | `GET` `POST` `PATCH` | `/api/contas/usuarios/` e `/api/contas/usuarios/<id>/senha/` |
| Auditoria | `GET` | `/api/contas/auditoria/` |
| Ativos | `GET` `POST` `PATCH` | `/api/ativos/` e `/api/ativos/<id>/` |
| Histórico | `GET` | `/api/historico/` |
| Ordens e logs | `GET` `POST` `PATCH` | `/api/ordens_manutencao/` e `/api/ordens_manutencao/<id>/logs/` |
| Backup | `GET` `POST` | `/api/backups/` e `/api/backups/<nome>/restaurar/` |

A lista completa, com regras e permissões, está no [README do back-end](https://github.com/MiguelSantos1910/ProjetoIntegrador_Backend#endpoints-da-api).

Não coloque senhas ou chaves em variáveis `VITE_*`: elas são incorporadas ao código enviado ao navegador.

## Executando localmente

### Pré-requisitos

- Node.js 20.19+ ou 22.12+ (exigido pelo Vite 8) e npm
- [Back-end](https://github.com/MiguelSantos1910/ProjetoIntegrador_Backend) rodando, local ou publicado

### 1. Acessar a pasta do front

```bash
git clone https://github.com/MiguelSantos1910/ProjetoIntegrador_Frontend.git
cd ProjetoIntegrador_Frontend/frontend
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar a API

```bash
cp .env.example .env
```

```env
# Back-end local
VITE_APP_API_URL=http://127.0.0.1:8000/api

# Mesma API usada pelo aplicativo mobile (servidor publicado)
# VITE_APP_API_URL=http://54.20.29.135/api
```

O `.env` não é versionado. Para o painel e o app mostrarem os mesmos dados, os dois precisam apontar para a mesma API. Sem a variável, o padrão é `http://127.0.0.1:8000/api`.

### 4. Iniciar

```bash
npm run dev
```

O Vite mostra o endereço no terminal (normalmente `http://localhost:5173`).

### 5. Gerar a versão de produção

```bash
npm run build     # gera dist/
npm run preview   # serve o dist/ localmente
```

## Usuários de teste

Use uma conta de cada papel. As mesmas contas valem para o app, desde que painel e app usem a mesma API.

| Usuário sugerido | Papel |
|---|---|
| `professor_teste` | `PROFESSOR` |
| `suporte_teste` | `SUPORTE` |
| `aluno_teste` | `ALUNO` |

Como criar:

1. Pelo terminal do back-end, com os comandos da seção [Usuários de teste](https://github.com/MiguelSantos1910/ProjetoIntegrador_Backend#usuários-de-teste) do README dele; **ou**
2. Pela tela `/cadastro` do painel (toda conta nasce `ALUNO`), entrando depois como professor e mudando o papel em **Perfis**.

As senhas **não ficam no repositório** e são entregues à banca separadamente. Use nomes em **minúsculas**: o app converte o usuário para minúsculas antes do login.

## Estrutura do projeto

```text
ProjetoIntegrador_Frontend/
├── .github/workflows/      # pipeline de build (GitHub Actions)
├── README.md
└── frontend/
    ├── public/             # favicon e ícones
    ├── src/
    │   ├── assets/css/     # um CSS por página e por componente
    │   ├── components/     # Table, Card, Form, ConfirmModal, Info, Chart, QrCode, Navbar
    │   ├── composables/    # status.js, formatData.js, gerarPdf.js
    │   ├── routes/         # index.js: rotas e controle de acesso por papel
    │   ├── services/       # api.js: Axios configurado
    │   ├── stores/         # stores Pinia de cada módulo
    │   ├── views/          # páginas
    │   ├── App.vue
    │   └── main.js
    ├── .env.example        # variáveis sem segredos
    ├── eslint.config.js
    ├── package.json
    └── vite.config.js
```

## Qualidade e CI

```bash
npm run build     # build de produção
npx eslint src    # verificação de estilo
```

O workflow [`.github/workflows/build.yml`](.github/workflows/build.yml) instala as dependências e roda o build em todo push para o `main` e em todo pull request. O ESLint ainda aponta 13 erros e 2 avisos de estilo, todos de nome de componente com uma só palavra e de `<img/>`, e por isso não bloqueia o pipeline. Os testes automatizados da API ficam no back-end.

## Aplicativo mobile e Realidade Aumentada

O app Flutter fica em repositório separado ([pi4-mobile-lando](https://github.com/LANDOSOUZA/pi4-mobile-lando)) e usa a mesma API. Ele faz login, lê o QR Code do ativo e mostra os dados sobre a imagem da câmera (RA), tem consulta manual como alternativa e lista e edita ativos conforme o papel.

O QR Code mostrado no detalhe do ativo, neste painel, é o mesmo que o app lê: o app consulta `GET /api/ativos/?codigo_qr=<código>`. Para o app e o painel verem os mesmos ativos, configure `VITE_APP_API_URL` com a URL usada pelo app.

## Limitações conhecidas

- **Categorias:** são os tipos fixos do back-end. A tela **Nova Categoria** ainda não grava, porque não existe API de categorias.
- **Sessão:** não há renovação automática do token. Quando ele expira, é preciso entrar de novo.
- **Erros por campo** devolvidos pela API ainda aparecem como uma mensagem geral nos formulários.
- **Paginação:** a lista mostra todos os ativos; os botões de página ainda não funcionam (a API não pagina).
- **Token no `localStorage`:** prático para o MVP, mas sensível a XSS (risco R7 em `docs/seguranca.md` do back-end).

## Créditos e licenças

Bibliotecas usadas, todas de código aberto: Vue, Vite, Vue Router, Pinia e Axios (MIT), Tailwind CSS (MIT), Chart.js e vue-chartjs (MIT), jsPDF e jspdf-autotable (MIT), qrcode.vue (MIT) e Lucide (ISC).

Os dados mostrados nas demonstrações são fictícios.

## Repositórios

| Parte | Repositório |
|---|---|
| Painel web (este) | https://github.com/MiguelSantos1910/ProjetoIntegrador_Frontend |
| Back-end (API) | https://github.com/MiguelSantos1910/ProjetoIntegrador_Backend |
| Aplicativo mobile | https://github.com/LANDOSOUZA/pi4-mobile-lando |

**Projeto:** Easy Asset, Projeto Integrador IV, ADS, SENAI Roberto Mange.
