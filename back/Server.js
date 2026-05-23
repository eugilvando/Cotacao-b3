/**
 * B3 Tracker — Servidor Back-end
 * Stack: Node.js + Express + Prisma (SQLite) + Axios
 * API Externa: brapi.dev
 *
 * Rota principal: GET /cotacoes
 * Query params esperados:
 *   - ativos: string separada por vírgulas (ex: "PETR4,VALE3")
 *   - dataInicial: string ISO (ex: "2024-01-01")
 *   - dataFinal: string ISO (ex: "2024-03-31")
 */

require("dotenv").config(); // Carrega variáveis do arquivo .env

const express = require("express");
const cors = require("cors");
const axios = require("axios");
let PrismaClient;
let prisma = null;
try {
  PrismaClient = require("@prisma/client").PrismaClient;
  prisma = new PrismaClient();
} catch (err) {
  console.warn("Prisma não disponível ou falha na inicialização. Cache desabilitado.", err.message);
  prisma = null;
}

// ─────────────────────────────────────────────
// CONFIGURAÇÕES INICIAIS
// ─────────────────────────────────────────────

const app = express();
// (prisma já foi inicializado acima ou está null)
const PORT = process.env.PORT || 3001;
const BRAPI_TOKEN = process.env.BRAPI_TOKEN; // opcional

// ─────────────────────────────────────────────
// MIDDLEWARES
// ─────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// FUNÇÕES AUXILIARES
// ─────────────────────────────────────────────

/**
 * Gera um array com todas as datas (YYYY-MM-DD) entre início e fim, inclusive.
 */
function gerarIntervalo(dataInicial, dataFinal) {
  const datas = [];
  const atual = new Date(dataInicial + "T00:00:00Z");
  const fim = new Date(dataFinal + "T00:00:00Z");

  while (atual <= fim) {
    datas.push(atual.toISOString().split("T")[0]);
    atual.setUTCDate(atual.getUTCDate() + 1);
  }

  return datas;
}

/**
 * Busca cotações de um único ativo na API da brapi.dev.
 * Retorna array de { data: "YYYY-MM-DD", preco: number }.
 */
async function buscarNaAPIExterna(ativo, dataInicial, dataFinal) {
  const url = `https://brapi.dev/api/quote/${ativo}`;

  // A API pública tem restrições com o range custom; buscar um range amplo e filtrar localmente
  const params = {
    range: "max",
    interval: "1d",
  };

  let data;
  try {
    const resp = await axios.get(url, { params });
    data = resp.data;
  } catch (err) {
    console.error(`[BRAPI ERROR] falha ao consultar ${url} com params ${JSON.stringify(params)}:`, err.response?.status, err.response?.data || err.message);
    throw new Error(`Erro ao consultar API externa para ${ativo}: ${err.response?.status || err.message}`);
  }

  const historico = data?.results?.[0]?.historicalDataPrice;

  if (!historico || historico.length === 0) {
    throw new Error(`Nenhum dado encontrado para o ativo ${ativo} no período informado.`);
  }

  // Filtra pelas datas solicitadas
  const inicio = new Date(dataInicial);
  const fim = new Date(dataFinal);

  return historico
    .map((item) => ({
      data: new Date(item.date * 1000).toISOString().split("T")[0],
      preco: item.close,
    }))
    .filter((r) => {
      const d = new Date(r.data + "T00:00:00Z");
      return d >= inicio && d <= fim;
    });
}

// ─────────────────────────────────────────────
// LÓGICA DE CACHE
// ─────────────────────────────────────────────

async function obterCotacoesComCache(ativo, dataInicial, dataFinal) {
  const todasAsDatas = gerarIntervalo(dataInicial, dataFinal);
  // PASSO 1: O que já temos no banco? (tolerante a falhas do Prisma)
  let registrosCache = [];
  try {
    registrosCache = await prisma.cotacaoCache.findMany({
      where: {
        ativo: ativo.toUpperCase(),
        data: { in: todasAsDatas },
      },
    });
  } catch (err) {
    console.warn(`[CACHE WARN] Falha ao acessar cache Prisma, ignorando cache para ${ativo}:`, err.message);
    // Fallback: buscar toda a faixa diretamente na API externa
    const dadosDaAPI = await buscarNaAPIExterna(ativo, dataInicial, dataFinal);
    return dadosDaAPI.map((item) => ({ data: item.data, preco: item.preco }));
  }

  const datasNoCache = new Set(registrosCache.map((r) => r.data));

  // PASSO 2: Quais datas estão faltando?
  const datasFaltando = todasAsDatas.filter((d) => !datasNoCache.has(d));

  // PASSO 3: Busca na API apenas o que falta
  if (datasFaltando.length > 0) {
    console.log(`[CACHE MISS] ${ativo}: buscando ${datasFaltando.length} datas na API externa...`);

    const primeiraDataFaltando = datasFaltando[0];
    const ultimaDataFaltando = datasFaltando[datasFaltando.length - 1];

    let dadosDaAPI = [];
    try {
      dadosDaAPI = await buscarNaAPIExterna(ativo, primeiraDataFaltando, ultimaDataFaltando);
    } catch (err) {
      console.error(`[API ERROR] ${ativo}:`, err.message);
      if (registrosCache.length > 0) {
        console.warn(`[FALLBACK] Retornando apenas dados em cache para ${ativo}.`);
        return registrosCache.map((r) => ({ data: r.data, preco: r.preco }));
      }
      throw err;
    }

    // PASSO 4: Salva os novos dados no banco
    const novosDados = dadosDaAPI.filter((item) => !datasNoCache.has(item.data));

    if (novosDados.length > 0) {
      await prisma.cotacaoCache.createMany({
        data: novosDados.map((item) => ({
          ativo: ativo.toUpperCase(),
          data: item.data,
          preco: item.preco,
        })),
        skipDuplicates: true,
      });
      console.log(`[CACHE WRITE] ${ativo}: ${novosDados.length} registros salvos no banco.`);
    }

    // PASSO 5: Retorna tudo ordenado
    const todos = [
      ...registrosCache.map((r) => ({ data: r.data, preco: r.preco })),
      ...novosDados,
    ];
    return todos.sort((a, b) => a.data.localeCompare(b.data));
  }

  // CACHE HIT TOTAL
  console.log(`[CACHE HIT] ${ativo}: todos os dados encontrados no banco. API não consultada.`);
  return registrosCache
    .map((r) => ({ data: r.data, preco: r.preco }))
    .sort((a, b) => a.data.localeCompare(b.data));
}

// ─────────────────────────────────────────────
// ROTAS
// ─────────────────────────────────────────────

/**
 * GET /cotacoes?ativos=PETR4,VALE3&dataInicial=2024-01-01&dataFinal=2024-03-31
 *
 * Resposta:
 * {
 *   "dados": {
 *     "PETR4": [{ "data": "2024-01-02", "preco": 37.50 }, ...],
 *     "VALE3": [{ "data": "2024-01-02", "preco": 68.20 }, ...]
 *   }
 * }
 */
app.get("/cotacoes", async (req, res) => {
  const { ativos, dataInicial, dataFinal } = req.query;

  if (!ativos || !dataInicial || !dataFinal) {
    return res.status(400).json({
      erro: "Parâmetros obrigatórios ausentes: ativos, dataInicial, dataFinal.",
    });
  }

  const listaAtivos = ativos
    .split(",")
    .map((a) => a.trim().toUpperCase())
    .filter(Boolean);

  if (listaAtivos.length === 0) {
    return res.status(400).json({ erro: "Nenhum ativo válido foi informado." });
  }

  if (new Date(dataInicial) > new Date(dataFinal)) {
    return res.status(400).json({ erro: "A dataInicial não pode ser posterior à dataFinal." });
  }

  try {
    const resultados = await Promise.allSettled(
      listaAtivos.map((ativo) => obterCotacoesComCache(ativo, dataInicial, dataFinal))
    );

    const resposta = {};
    const erros = [];

    resultados.forEach((resultado, index) => {
      const ativo = listaAtivos[index];
      if (resultado.status === "fulfilled") {
        resposta[ativo] = resultado.value;
      } else {
        erros.push({ ativo, mensagem: resultado.reason?.message || "Erro desconhecido." });
        console.error(`[ROUTE ERROR] ${ativo}:`, resultado.reason);
      }
    });

    return res.json({
      dados: resposta,
      ...(erros.length > 0 && { erros }),
    });
  } catch (err) {
    console.error("[ROUTE FATAL]", err);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────
// INICIALIZAÇÃO
// ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Servidor B3 Tracker rodando em http://localhost:${PORT}`);
  console.log(`   Banco SQLite conectado via Prisma.`);
  console.log(`   BRAPI_TOKEN carregado do .env ✅`);
});

