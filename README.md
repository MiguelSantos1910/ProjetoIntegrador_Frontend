# Easy Asset — Frontend

**Sistema de Gestão de Ativos | Projeto Integrador**

Frontend web do Easy Asset, um sistema de gestão de ativos desenvolvido para centralizar o cadastro, a consulta, o acompanhamento e a manutenção de equipamentos.

A aplicação é construída com **Vue.js, Vite, Tailwind CSS e Pinia**, consumindo uma API REST desenvolvida em Django e Django REST Framework. A arquitetura também prevê a integração com um aplicativo mobile desenvolvido em Flutter, compartilhando a mesma API.

O projeto está sendo desenvolvido de forma incremental, com foco em uma interface organizada, componentes reutilizáveis e separação entre apresentação, gerenciamento de estado e comunicação com o backend.

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Páginas da aplicação](#páginas-da-aplicação)
- [Arquitetura do frontend](#arquitetura-do-frontend)
- [Integração com a API](#integração-com-a-api)
- [Gerenciamento de estado](#gerenciamento-de-estado)
- [Relatórios e indicadores](#relatórios-e-indicadores)
- [Persistência de configurações](#persistência-de-configurações)
- [Executando localmente](#executando-localmente)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Próximas melhorias](#próximas-melhorias)
- [Status do projeto](#status-do-projeto)

## Sobre o projeto

O Easy Asset tem como objetivo facilitar o gerenciamento do ciclo de vida dos ativos, reunindo em uma única aplicação informações sobre equipamentos, categorias, disponibilidade e manutenção.

A interface web funciona como o ambiente principal de consulta e administração, permitindo acompanhar os indicadores do sistema, gerenciar ativos e ordens de manutenção, consultar históricos e gerar relatórios.

A aplicação foi estruturada para consumir uma API centralizada, evitando que o frontend mantenha regras de negócio ou acesso ao banco de dados de forma independente.

## Tecnologias

| Tecnologia | Finalidade |
|---|---|
| Vue.js 3 | Construção da interface baseada em componentes |
| Vite | Ambiente de desenvolvimento e build |
| Tailwind CSS | Estilização da interface |
| Pinia | Gerenciamento de estado compartilhado |
| Vue Router | Navegação entre páginas |
| Axios | Comunicação HTTP com a API |
| Lucide Vue Next | Ícones da interface |
| `localStorage` | Persistência local das preferências da interface |
| Django REST Framework | Backend consumido pela aplicação |

O backend e o aplicativo mobile são projetos separados. O frontend web não acessa diretamente o banco de dados: todas as operações remotas são realizadas por meio da API.

## Funcionalidades

### Dashboard

O dashboard apresenta uma visão geral dos ativos e das operações do sistema.

Os indicadores trabalhados na interface incluem:

- Total de ativos cadastrados.
- Ativos em manutenção.
- Ativos disponíveis.
- Ativos que exigem atenção.
- Visualizações gráficas para acompanhamento dos dados.

Os valores exibidos devem ser alimentados pelos dados disponíveis no backend, evitando manter indicadores definitivos apenas em valores fixos no frontend.

### Gestão de ativos

O módulo de ativos permite organizar as informações dos equipamentos cadastrados.

Funcionalidades contempladas na interface:

- Listagem e consulta de ativos.
- Cadastro de novos ativos.
- Edição das informações.
- Visualização dos detalhes do equipamento.
- Identificação por categoria e status.
- Consulta de informações relacionadas ao ativo.

A disponibilidade de cada operação depende da integração com a API e das permissões do usuário autenticado.

### Categorias

O módulo de categorias permite organizar os ativos por classificação.

A interface contempla páginas para:

- Listagem de categorias.
- Cadastro de novas categorias.

As operações de persistência dependem dos endpoints correspondentes no backend.

### Manutenção

O módulo de manutenção permite acompanhar as ordens relacionadas aos ativos.

O modelo de ordem de manutenção utilizado no backend contempla:

- Ativo relacionado.
- Descrição do serviço.
- Responsável.
- Status da ordem.
- Custo estimado.
- Data de abertura.
- Data de conclusão.

Os status definidos no modelo são `Pendente`, `Em andamento`, `Concluída` e `Cancelada`.

A interface de manutenção e os relatórios devem refletir os dados efetivamente retornados pela API.

### Histórico das ordens de manutenção

O frontend também contempla a integração com o histórico de alterações das ordens.

A consulta utiliza o endpoint:

```http
GET /api/ordens_manutencao/<id>/logs/
```

O histórico pode apresentar informações como:

- Identificação da ordem.
- Ação registrada.
- Descrição da alteração.
- Status anterior.
- Novo status.
- Usuário relacionado.
- Data do evento.

A exibição depende de os registros estarem disponíveis no backend e de o usuário ter autorização para consultar os dados.

### Usuários e autenticação

A aplicação possui páginas de login e cadastro de usuários.

A integração com o backend utiliza autenticação por JWT. O token de acesso deve acompanhar as requisições protegidas da API.

O frontend também precisa tratar situações como credenciais inválidas, sessão expirada, falhas de comunicação e respostas de acesso negado.

A autorização definitiva deve ser aplicada pelo backend; a interface não substitui as permissões do servidor.

### Configurações

A página de configurações permite ajustar preferências da interface.

As preferências que precisam permanecer após a navegação ou a atualização da página podem ser persistidas no `localStorage` do navegador.

Esse armazenamento é destinado às configurações locais da interface e não deve ser utilizado como substituto do banco de dados central para ativos, usuários ou ordens de manutenção.

### Relatórios

A página de relatórios reúne informações para acompanhamento dos ativos e das operações de manutenção.

Entre os recursos trabalhados estão:

- Tabelas de dados.
- Indicadores e gráficos.
- Visualização de ordens por status.
- Filtros para consulta.
- Histórico das ordens de manutenção.
- Exportação de relatórios em PDF.

A exportação em PDF é realizada pela aplicação web utilizando os dados disponíveis na interface. Ela não implica necessariamente a existência de um endpoint específico de exportação no backend.

## Páginas da aplicação

A aplicação possui páginas organizadas por responsabilidade.

| Página | Responsabilidade |
|---|---|
| `Login.vue` | Autenticação do usuário |
| `CadastroUsuario.vue` | Cadastro de usuários |
| `Dashboard.vue` | Indicadores e visão geral |
| `Ativos.vue` | Listagem e gerenciamento de ativos |
| `CadastroAtivo.vue` | Cadastro de ativos |
| `DetalheAtivo.vue` | Detalhes do equipamento |
| `ManutencaoAtivo.vue` | Gestão de manutenção |
| `Relatorios.vue` | Indicadores, tabelas, histórico e exportação em PDF |
| `Categorias.vue` | Consulta de categorias |
| `NovaCategoria.vue` | Cadastro de categorias |
| `Configuracoes.vue` | Preferências da interface |

Os nomes acima correspondem às páginas trabalhadas no projeto; os nomes e a organização definitivos devem seguir os arquivos existentes no repositório.

## Arquitetura do frontend

A arquitetura separa a interface visual, o gerenciamento de estado e a comunicação com o backend.

```text
┌───────────────────────────────────┐
│             Vue.js                │
│                                   │
│  Views                            │
│  ├── Dashboard                    │
│  ├── Ativos                       │
│  ├── Manutenção                   │
│  ├── Categorias                   │
│  ├── Relatórios                   │
│  └── Configurações                │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│       Componentes reutilizáveis   │
│                                   │
│  Formulários                      │
│  Cards                            │
│  Navegação                        │
│  Tabelas e elementos visuais      │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│        Pinia e serviços            │
│                                   │
│  Estado compartilhado             │
│  Requisições HTTP                 │
│  Tratamento de respostas          │
└─────────────────┬─────────────────┘
                  │
                  │ HTTP / REST
                  ▼
┌───────────────────────────────────┐
│      Django REST Framework        │
│                                   │
│  Autenticação e permissões        │
│  Ativos e categorias              │
│  Ordens e histórico               │
└───────────────────────────────────┘
```

A separação permite que os componentes visuais sejam reutilizados e que as chamadas à API não precisem ser implementadas individualmente em cada página.

## Gerenciamento de estado

O projeto utiliza Pinia para compartilhar informações entre componentes e páginas quando necessário.

O gerenciamento de estado pode ser utilizado para:

- Armazenar os dados carregados da API.
- Compartilhar listas e indicadores.
- Centralizar operações de consulta, cadastro, edição e exclusão.
- Controlar estados de carregamento e erros.
- Evitar requisições duplicadas desnecessárias.

Por exemplo, a store de ativos pode disponibilizar os ativos cadastrados e o total de registros para diferentes partes do dashboard e das páginas de consulta.

O estado em memória e a persistência são conceitos diferentes: os dados do servidor devem ser carregados ou atualizados conforme necessário, enquanto preferências locais podem ser mantidas no navegador.

## Integração com a API

O frontend utiliza Axios para realizar requisições HTTP ao backend.

A configuração da API deve ficar centralizada em um serviço, evitando URLs repetidas em diferentes arquivos.

Exemplos de operações utilizadas pela aplicação:

| Operação | Método | Endpoint |
|---|---|---|
| Login | `POST` | `/api/token/` |
| Consultar usuário autenticado | `GET` | `/api/contas/me/` |
| Listar ativos | `GET` | `/api/ativos/` |
| Cadastrar ativo | `POST` | `/api/ativos/` |
| Consultar detalhes de um ativo | `GET` | `/api/ativos/<id>/` |
| Listar ordens de manutenção | `GET` | `/api/ordens_manutencao/` |
| Criar ordem de manutenção | `POST` | `/api/ordens_manutencao/` |
| Consultar logs de uma ordem | `GET` | `/api/ordens_manutencao/<id>/logs/` |

Esses caminhos devem corresponder às rotas configuradas no backend.

### Configuração da URL base

A URL base deve ser configurada de acordo com o ambiente de execução, por exemplo, utilizando variáveis de ambiente do Vite.

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

O serviço Axios pode utilizar essa variável para definir sua `baseURL`.

Em produção, a variável deve apontar para a URL publicada da API. Não coloque senhas, chaves secretas ou outras credenciais privadas em variáveis `VITE_*`, pois elas podem ser incorporadas ao código enviado ao navegador.

### Tratamento de requisições

As chamadas à API devem tratar adequadamente:

- Erros de validação.
- Falhas de conexão.
- Respostas `401 Unauthorized`.
- Respostas `403 Forbidden`.
- Recursos inexistentes.
- Estados de carregamento.
- Respostas vazias ou listas sem resultados.

Quando a API exigir autenticação, o token de acesso deve ser enviado no cabeçalho `Authorization`.

## Relatórios e indicadores

A página `Relatorios.vue` concentra as visualizações e a exportação de dados.

O desenvolvimento dessa página inclui a integração de tabelas de ordens de manutenção e usuários, filtros e geração de PDFs.

Também trabalhamos na integração do histórico das ordens de manutenção com o endpoint de logs, incluindo o tratamento de carregamento e erros dessa consulta.

Os gráficos devem utilizar os dados efetivamente carregados. Recursos ainda parciais, como a visualização de ordens por status, devem ser considerados em desenvolvimento até que sua implementação e seus resultados sejam validados.

## Persistência de configurações

As preferências da página `Configuracoes.vue` podem ser salvas no `localStorage`.

Esse mecanismo permite manter opções da interface entre visitas e atualizações da página no mesmo navegador.

É importante distinguir os dados armazenados localmente dos dados persistidos no backend:

- **`localStorage`:** preferências locais da interface.
- **Pinia:** estado compartilhado durante a execução da aplicação, salvo se houver persistência adicional configurada.
- **API Django:** dados centrais de ativos, usuários, categorias e ordens de manutenção.

Dados sensíveis, especialmente credenciais e tokens, exigem cuidados específicos e não devem ser armazenados indiscriminadamente no `localStorage`.

## Executando localmente

### Pré-requisitos

- Node.js em uma versão compatível com o projeto.
- npm.
- Backend Django configurado e disponível para testar as operações que dependem da API.

### 1. Acessar a pasta do frontend

Entre no diretório que contém o `package.json`:

```bash
cd frontend
```

Ajuste o caminho conforme a organização do seu repositório.

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar a API

Crie ou ajuste o arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Utilize a URL correspondente à configuração do serviço Axios do projeto.

### 4. Iniciar o ambiente de desenvolvimento

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação.

### 5. Gerar a versão de produção

```bash
npm run build
```

O comando gera os arquivos de produção no diretório configurado pelo Vite, normalmente `dist/`.

Para conferir os scripts e comandos disponíveis, consulte o `package.json` do projeto.

## Estrutura do projeto

A estrutura conceitual do frontend é organizada em componentes, páginas, stores, serviços e rotas.

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── stores/
│   ├── services/
│   ├── router/
│   ├── App.vue
│   └── main.js
├── .env
├── package.json
├── vite.config.js
└── README.md
```

### Responsabilidade dos diretórios

| Diretório | Responsabilidade |
|---|---|
| `components/` | Componentes visuais reutilizáveis |
| `views/` | Páginas da aplicação |
| `stores/` | Estado compartilhado gerenciado pelo Pinia |
| `services/` | Comunicação com a API e serviços auxiliares |
| `router/` | Definição das rotas de navegação |
| `assets/` | Recursos visuais utilizados pela interface |
| `public/` | Arquivos estáticos disponibilizados diretamente |

A estrutura é ilustrativa e deve ser ajustada aos diretórios efetivamente presentes no repositório.

## Aplicativo mobile e Realidade Aumentada

O aplicativo mobile é uma extensão planejada do Easy Asset, desenvolvida separadamente em Flutter e integrada à mesma API.

Entre as possibilidades de evolução estão:

- Consulta de ativos em campo.
- Identificação por QR Code.
- Consulta do histórico do equipamento.
- Registro de movimentações.
- Integração com recursos de Realidade Aumentada.

## Próximas melhorias

- Consolidar o tratamento de autenticação e expiração de sessão.
- Ampliar o tratamento de erros das requisições.
- Finalizar e validar os gráficos de relatórios.
- Melhorar a atualização dos indicadores do dashboard.
- Validar todas as operações de categorias com a API.
- Revisar as permissões de navegação conforme o papel do usuário.
- Ampliar os testes dos componentes e das páginas.
- Validar a interface em diferentes tamanhos de tela.
- Configurar e testar o build para publicação.
- Evoluir a integração com o aplicativo mobile.

## Repositórios e tecnologias relacionadas

- **Frontend web:** Vue.js, Vite, Tailwind CSS e Pinia.
- **Backend:** Django e Django REST Framework.
- **Aplicativo mobile:** Flutter.

---

**Easy Asset — Sistema de Gestão de Ativos**

Uma aplicação web para centralizar o gerenciamento de equipamentos, acompanhar manutenções e consultar informações operacionais por meio de uma API compartilhada.
