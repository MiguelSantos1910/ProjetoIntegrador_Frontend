# Sistema de Gestão de Ativos

Sistema para **gestão, rastreamento e controle de ativos** de uma organização, centralizando informações sobre equipamentos, localização, movimentações, manutenção, usuários e histórico dos ativos.

A solução é composta por uma **aplicação web**, responsável pela gestão administrativa e operacional, e um **aplicativo mobile**, utilizado como extensão do sistema para operações em campo.

## 📋 Sobre o projeto

O projeto tem como objetivo facilitar o controle do ciclo de vida dos ativos de uma empresa, permitindo registrar, consultar e acompanhar equipamentos e outros bens de forma centralizada.

A aplicação permite que cada ativo possua uma identificação única, possibilitando seu acompanhamento desde o cadastro até suas movimentações, manutenções e alterações de status.

A arquitetura foi pensada para utilizar uma **API centralizada**, compartilhada entre o sistema web e o aplicativo mobile.

```text
                    ┌─────────────────┐
                    │   Aplicação Web │
                    │   Gestão/Admin  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │       API       │
                    │ Regras de negócio│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Banco de     │
                    │     Dados       │
                    └─────────────────┘
                             ▲
                             │
                    ┌────────┴────────┐
                    │  Aplicativo     │
                    │     Mobile      │
                    │   Operação      │
                    └─────────────────┘
```

## 🎯 Objetivos

* Centralizar o cadastro e gerenciamento de ativos.
* Facilitar a localização e identificação dos ativos.
* Registrar movimentações e alterações de status.
* Manter um histórico das operações realizadas.
* Controlar processos de manutenção.
* Permitir acompanhamento dos ativos em campo.
* Disponibilizar informações para relatórios e tomada de decisão.
* Integrar operações realizadas pelo aplicativo mobile com a plataforma web.

## 🚀 Funcionalidades

### Gestão de ativos

* Cadastro de ativos.
* Edição e atualização de informações.
* Consulta e pesquisa de ativos.
* Visualização detalhada do ativo.
* Controle de status.
* Identificação única.
* Associação de localização.
* Registro de movimentações.
* Histórico do ativo.
* Histórico de manutenção.

### Identificação dos ativos

Cada ativo pode possuir um identificador único, permitindo sua localização e consulta de forma rápida.

Entre as possibilidades previstas estão:

* QR Code.
* Código de identificação.
* NFC.

O QR Code pode ser utilizado para identificar rapidamente um equipamento através do aplicativo mobile.

### 📍 Localização e movimentação

O sistema permite registrar onde determinado ativo está localizado e acompanhar suas movimentações.

Exemplos de informações:

```text
Ativo
 ├── Localização atual
 ├── Localização anterior
 ├── Data da movimentação
 ├── Responsável
 └── Histórico de movimentações
```

Isso permite manter uma rastreabilidade do deslocamento dos ativos dentro da organização.

### 🔧 Manutenção

O sistema também possui suporte ao gerenciamento de manutenção dos ativos.

É possível trabalhar com:

* Histórico de manutenções.
* Ordens de serviço.
* Status da manutenção.
* Registro de intervenções.
* Associação da manutenção ao ativo.
* Histórico de serviços realizados.

### 👥 Usuários e permissões

O sistema possui estrutura para controle de usuários e permissões.

As permissões podem ser utilizadas para determinar quais funcionalidades cada usuário pode acessar e quais operações pode realizar.

Exemplo:

```text
Administrador
    ├── Gerenciar usuários
    ├── Gerenciar ativos
    ├── Visualizar relatórios
    └── Gerenciar configurações

Operador
    ├── Consultar ativos
    ├── Movimentar ativos
    └── Registrar operações
```

### 📊 Dashboard

O dashboard apresenta uma visão geral dos ativos e das operações do sistema.

Informações que podem ser apresentadas:

* Quantidade total de ativos.
* Ativos por status.
* Ativos por localização.
* Ativos em manutenção.
* Movimentações recentes.
* Ordens de serviço.
* Indicadores operacionais.

### 📑 Relatórios

O sistema permite organizar informações para acompanhamento e análise dos ativos.

Exemplos:

* Relatório de ativos.
* Relatório de movimentações.
* Relatório de manutenção.
* Relatório por localização.
* Histórico de um ativo.

## 📱 Aplicativo Mobile

O aplicativo mobile funciona como uma **extensão da plataforma web**, sendo voltado principalmente para operações realizadas diretamente no ambiente onde os ativos estão localizados.

Entre as possibilidades de utilização estão:

* Consulta de ativos.
* Identificação através de QR Code.
* Registro de movimentações.
* Atualização de informações.
* Consulta do histórico.
* Registro de operações em campo.
* Acesso às informações do ativo através da API.

### Realidade Aumentada

Uma das funcionalidades planejadas para o aplicativo é a utilização de **Realidade Aumentada (RA)**.

A RA pode ser utilizada para fornecer informações sobre um ativo diretamente no ambiente físico.

Exemplo de fluxo:

```text
Usuário aponta a câmera
        ↓
Identificação do ativo
        ↓
Consulta à API
        ↓
Informações do ativo
        ↓
Informações exibidas em RA
```

Dessa forma, o aplicativo pode funcionar como uma ferramenta operacional, permitindo que o usuário consulte informações sem precisar retornar ao sistema web.

> A utilização de Realidade Aumentada faz parte da evolução do projeto e não necessariamente do MVP inicial.

## 🔄 Fluxo geral

O fluxo principal da aplicação pode ser representado da seguinte forma:

```text
Cadastro do ativo
       ↓
Identificação única
       ↓
Localização do ativo
       ↓
Movimentação / utilização
       ↓
Manutenção
       ↓
Atualização do histórico
       ↓
Relatórios e acompanhamento
```

Todos os módulos utilizam a mesma fonte central de dados através da API.

## 🏗️ Arquitetura

A arquitetura utiliza uma separação entre apresentação, regras de negócio e persistência de dados.

```text
┌──────────────────────────────┐
│          FRONTEND            │
│                              │
│        Aplicação Web         │
└──────────────┬───────────────┘
               │
               │ HTTP / REST
               ▼
┌──────────────────────────────┐
│             API              │
│                              │
│  Autenticação                │
│  Usuários                    │
│  Ativos                      │
│  Movimentações               │
│  Manutenção                  │
│  Ordens de Serviço           │
│  Relatórios                  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          DATABASE            │
│                              │
│  Usuários                    │
│  Ativos                      │
│  Localizações                │
│  Movimentações               │
│  Manutenções                 │
│  Ordens de Serviço           │
└──────────────────────────────┘
               ▲
               │
          HTTP / REST
               │
┌──────────────┴───────────────┐
│       APLICATIVO MOBILE       │
│                              │
│  Consulta                    │
│  QR Code                     │
│  Operações em campo          │
│  Realidade Aumentada         │
└──────────────────────────────┘
```

## 🧩 Estrutura conceitual

O sistema é organizado em torno de algumas entidades principais:

```text
Usuário
   │
   ├── Permissões
   │
   └── Operações
          │
          ▼
        Ativo
          │
          ├── Localização
          ├── Status
          ├── Movimentações
          ├── Manutenções
          └── Ordens de Serviço
```

## 🔐 Segurança

A aplicação deve utilizar autenticação e autorização para controlar o acesso às funcionalidades.

Principais pontos:

* Autenticação de usuários.
* Controle de permissões.
* Proteção das rotas da API.
* Validação dos dados enviados.
* Controle de acesso às operações.
* Registro de informações relevantes para rastreabilidade.

## 🛠️ Tecnologias

A stack pode ser organizada da seguinte forma:

### Frontend Web

* Vue.js
* Vite
* Tailwind CSS
* Pinia

### Backend

* Node.js
* Express
* API REST

### Banco de dados

* PostgreSQL

### Mobile

Aplicativo mobile integrado à mesma API utilizada pelo sistema web.

### Recursos adicionais

* QR Code.
* NFC.
* Geolocalização.
* Realidade Aumentada.

> As tecnologias específicas do aplicativo mobile e da camada de RA podem ser definidas conforme a implementação do projeto.

## 📁 Estrutura do projeto

Uma possível organização:

```text
gestao-ativos/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   ├── services/
│   │   └── router/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
│   │   └── ...
│   └── ...
│
├── mobile/
│   ├── src/
│   └── ...
│
└── README.md
```

## 🗺️ MVP

A primeira versão do sistema tem como foco as funcionalidades essenciais de gestão.

### Incluído no MVP

* [ ] Dashboard.
* [ ] Cadastro de ativos.
* [ ] Consulta e busca de ativos.
* [ ] Atualização de ativos.
* [ ] Controle de status.
* [ ] Identificação por QR Code.
* [ ] Cadastro e gerenciamento de usuários.
* [ ] Controle de permissões.
* [ ] Registro de movimentações.
* [ ] Localização dos ativos.
* [ ] Histórico de movimentações.
* [ ] Histórico de manutenção.
* [ ] Ordens de serviço.
* [ ] Relatórios.
* [ ] Integração com aplicativo mobile.

### Evoluções futuras

* [ ] Realidade Aumentada.
* [ ] Recursos avançados de localização.
* [ ] Melhorias na operação em campo.
* [ ] Suporte a múltiplos usuários simultâneos em maior escala.

## 📌 Status do projeto

**Em desenvolvimento 🚧**

O projeto está sendo desenvolvido de forma incremental, começando pelas funcionalidades principais de gestão e posteriormente incorporando recursos avançados para operação em campo.

## 💡 Possíveis aplicações

O sistema pode ser utilizado para gerenciamento de:

* Equipamentos industriais.
* Máquinas.
* Ferramentas.
* Equipamentos de TI.
* Veículos.
* Infraestrutura.
* Patrimônio empresarial.
* Outros tipos de ativos físicos.

## 📄 Licença

Este projeto pode receber uma licença específica conforme a finalidade de publicação e distribuição do sistema.

---

**Projeto de Gestão de Ativos**

Uma plataforma integrada para **controle, rastreamento, manutenção e operação de ativos**, combinando gestão web com recursos mobile para utilização em campo.
