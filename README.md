# Desafio Técnico - Consulta de Ativos B3
Projeto desenvolvido para o Inoa.

## Projeto com design desenvolvido em figma e convertido para React.
Link do figma: [Link do arquivo do design em figma](https://www.figma.com/design/skwZeknYjo1ZSXtsT1lUHt/Inoa---B3?node-id=223-7650&t=6zr5g6sRzrFFvr6B-1)

---

## 🚀 Sobre o Processo de Desenvolvimento

Este projeto foi construído seguindo padrões de UX/UI e em seguida desenvolvimento do Front-end. O fluxo de trabalho combinou ação humana em design e regras de negócio com o suporte de Inteligência Artificial para acelerar e otimizar a codificação.

*   **Front-end (Híbrido):** A estrutura base, arquitetura de componentes, refinamento visual pixel-perfect e a aplicação do Design System foram concebidos e implementados por mim. A IA atuou como suporte na estruturação rápida dos componentes React e lógica de estados, contando com **revisão humana em todas as etapas** para garantir um código limpo mais rápido e funcional.
*   **Back-end (Copiloto):** A estrutura do servidor e a camada de dados foram construídas com forte suporte de IA, permitindo uma rápida integração de rotas e mapeamento do banco de dados, sempre sob supervisão para validação da segurança e arquitetura, foi utilizanda a API da https://brapi.dev/ para consultas dos ativos. (Para testes o auto completar exibe os ativos de "PETR4", "VALE3", "MGLU3", "ITUB4" )

---

## 🛠️ Funcionalidades Principais

*   **Painel de Resultados Dinâmico:** Exibição imediata de um dashboard completo assim que a busca é realizada, ocultando o estado vazio inicial.
*   **Cards de Resumo Automáticos:** Cards no topo que calculam e exibem em tempo real o Preço Atual, Variação Percentual (com indicadores visuais de tendência ↗/↘), Preço Mínimo e Preço Máximo do período selecionado.
*   **Input Inteligente de Ativos (Multi-select por Tags):** O campo de busca transforma os ativos digitados em tags interativas ao pressionar `Enter` ou `,` (vírgula), permitindo a exclusão individual clicando no botão `×`.
*   **Autocomplete Customizado:** Sistema de autocompletar integrado e controlado via estado do React, sugerindo as principais ações e FIIs da B3 conforme o usuário digita.
*   **Alternância de Gráficos (Toggle View):** Botão posicionado à direita que permite ao usuário alternar instantaneamente a visualização dos dados entre **Gráfico de Barras Agrupadas** e **Gráfico de Linhas**, utilizando a biblioteca Recharts.
*   **Limpeza de Consulta:** Opção de resetar o painel de resultados com apenas um clique, retornando a interface para o estado inicial amigável.
*   **Histórico de Pesquisas:** Seção visual com atalhos para as pesquisas anteriores mais comuns do usuário.

---

## 📊 Visualização com Dados Simulados (Mock)

Para facilitar a avaliação técnica da interface, o projeto conta com um **gerador de dados simulados (mock)** que roda de forma totalmente offline no Front-end. 

Caso o Back-end não esteja conectado, o sistema gera automaticamente preços fictícios flutuantes e estatísticas coerentes com base nas datas e ativos preenchidos no formulário. Isso garante a validação completa de todas as interações de tela, responsividade do gráfico e comportamento dos cards de resumo sem a dependência imediata de APIs externas.

---

## 💻 Tecnologias Utilizadas

*   **Front-end:** React (Vite), JavaScript, CSS, Recharts (Gráficos), Ícones em formato SVG integrado.
*   **Back-end:** Node.js, Express, Cors, Axios.
*   **Banco de Dados & ORM:** SQLite e Prisma ORM.


## ⚙️ Como Rodar o Projeto Localmente

Siga os comandos abaixo no terminal para clonar o repositório, instalar as dependências e iniciar as aplicações.

### 📋 Pré-requisitos
*   **Node.js** (Versão 18 ou superior)
*   **Git**

---

### 1. Clonar o Repositório
```bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
cd seu-repositorio

---
### 2. Inicializar o Back-end (Node.js + Express + Prisma)
Abra o terminal na raiz do projeto e execute a sequência de comandos abaixo para configurar o servidor e o banco de dados local:

Bash
### 1. Entrar na pasta do servidor
cd back

### 2. Instalar as dependências do projeto
npm install

### 3. Criar o banco de dados SQLite local e rodar as migrações do Prisma
npx prisma migrate dev --name init

### 4. Iniciar o servidor Node
node server.js
O servidor do Back-end iniciará por padrão na porta 3001 (http://localhost:3001).

---
### 3. Inicializar o Front-end (React + Vite)
Abra uma nova aba ou janela no seu terminal (mantendo o servidor do back-end rodando na aba anterior) e execute os seguintes comandos:

Bash
### 1. Garantir que está na pasta do front-end
cd front

### 2. Instalar as dependências da interface
npm install

### 3. Iniciar o servidor de desenvolvimento do Vite
npm run dev