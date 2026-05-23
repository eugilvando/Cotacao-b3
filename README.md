# Desafio Técnico - Consulta de Ativos B3
Projeto desenvolvido para o Inoa.

## Projeto com design desenvolvido em figma e convertido para React.
Link do figma: [Link do arquivo do design em figma](https://www.figma.com/design/skwZeknYjo1ZSXtsT1lUHt/Inoa---B3?node-id=223-7650&t=6zr5g6sRzrFFvr6B-1)

---

## 🚀 Sobre o Processo de Desenvolvimento

Este projeto foi construído seguindo padrões de UX/UI e desenvolvimento do Front-end. O fluxo de trabalho combinou ação humana em design e regras de negócio com o suporte de Inteligência Artificial para acelerar e otimizar a codificação.

*   **Front-end (Híbrido):** A estrutura base, arquitetura de componentes, refinamento visual pixel-perfect e a aplicação do Design System foram concebidos e implementados por mim. A IA atuou como suporte na estruturação rápida dos componentes React e lógica de estados, contando com **revisão humana minuciosa em todas as etapas** para garantir um código limpo mais limpo possível.
*   **Back-end (Copiloto):** A estrutura do servidor e a camada de dados foram construídas com forte suporte de IA, permitindo uma rápida integração de rotas e mapeamento do banco de dados, sempre sob supervisão para validação da segurança e arquitetura, utilizando a API da https://brapi.dev/.

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
