import React, { useState } from 'react';
import FormularioCotacao from './components/FormularioCotacao';
import GraficoCotacao from './components/GraficoCotacao';
import { gerarDadosCotacao } from './mock/geradorMock';
import './App.css';

function App() {
  // Iniciamos como null para exibir a tela de "Nenhum Resultado"
  const [resultado, setResultado] = useState(null);
  const [usarDadosMock, setUsarDadosMock] = useState(true);
  const [listaAtivos, setListaAtivos] = useState([]);
  const DEFAULT_PLACEHOLDERS = ['VALE3', 'PETR4', 'ITUB4'];
  const [pesquisasAnteriores, setPesquisasAnteriores] = useState(() => {
    try {
      const raw = localStorage.getItem('pesquisasAnteriores');
      const saved = raw ? JSON.parse(raw) : [];
      // Garantir placeholders fixos no início e sem duplicatas
      const combined = [...DEFAULT_PLACEHOLDERS, ...saved.filter(s => !DEFAULT_PLACEHOLDERS.includes(s))];
      return combined.slice(0, 9);
    } catch (e) { return DEFAULT_PLACEHOLDERS.slice(); }
  });

  const lidarComBusca = (filtros) => {
    if (usarDadosMock) {
      // Dispara o gerador mock com os dados reais digitados na tela
      const dadosGerados = gerarDadosCotacao(filtros);
      setResultado(dadosGerados);
      // atualiza histórico de pesquisas (mock)
      const novos = (filtros.ativos || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
      const combined = [...novos, ...pesquisasAnteriores.filter(p => !novos.includes(p))];
      // garantir placeholders sempre presentes no início
      const withDefaults = [...DEFAULT_PLACEHOLDERS, ...combined.filter(s => !DEFAULT_PLACEHOLDERS.includes(s))];
      const top9 = withDefaults.filter((v, i, a) => a.indexOf(v) === i).slice(0, 9);
      setPesquisasAnteriores(top9);
      try { localStorage.setItem('pesquisasAnteriores', JSON.stringify(top9)); } catch(e){}
    } else {
      // Requisição real ao backend
      const params = new URLSearchParams({
        ativos: filtros.ativos,
        dataInicial: filtros.dataInicio,
        dataFinal: filtros.dataFim,
      });

      fetch(`http://localhost:3001/cotacoes?${params.toString()}`)
        .then((r) => r.json())
        .then((json) => {
          // Esperamos { dados: { PETR4: [{data, preco}, ...], ... } }
          const dados = json.dados || {};
          const ativos = Object.keys(dados);

          // Monta o array de datas ordenadas
          const todasDatas = new Set();
          ativos.forEach((a) => (dados[a] || []).forEach((d) => todasDatas.add(d.data)));
          const listaDatas = Array.from(todasDatas).sort();

          const dadosParaOGrafico = listaDatas.map((d) => {
            const day = d.split('-');
            const name = `${day[2]}-${day[1]}-${day[0]}`; // DD-MM-YYYY
            const obj = { name };
            ativos.forEach((a) => {
              const registro = (dados[a] || []).find((r) => r.data === d);
              obj[a] = registro ? registro.preco : null;
            });
            return obj;
          });

          // Monta cards
          const cards = ativos.map((a) => {
            const precos = (dados[a] || []).map((r) => r.preco);
            const precoAtual = precos[precos.length - 1] ?? 0;
            const precoInicial = precos[0] ?? precoAtual;
            const min = Math.min(...precos);
            const max = Math.max(...precos);
            const variacaoPercentual = precoInicial ? parseFloat((((precoAtual - precoInicial) / precoInicial) * 100).toFixed(2)) : 0;
            return {
              ativo: a,
              precoAtual,
              variacaoPercentual: Math.abs(variacaoPercentual),
              subiu: variacaoPercentual >= 0,
              min: isFinite(min) ? min : precoAtual,
              max: isFinite(max) ? max : precoAtual,
            };
          });

          const periodoTexto = `Da: ${filtros.dataInicio.split('-').reverse().join('/')} - Até: ${filtros.dataFim.split('-').reverse().join('/')}`;

          setResultado({ dadosParaOGrafico, ativosDetectados: ativos, cards, periodoTexto });
          // Atualiza histórico de pesquisas (ativos individuais), mantendo ordem e únicos
          const novos = (filtros.ativos || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
          const combined = [...novos, ...pesquisasAnteriores.filter(p => !novos.includes(p))];
          // garantir placeholders sempre presentes no início
          const withDefaults = [...DEFAULT_PLACEHOLDERS, ...combined.filter(s => !DEFAULT_PLACEHOLDERS.includes(s))];
          const top9 = withDefaults.filter((v, i, a) => a.indexOf(v) === i).slice(0, 9);
          setPesquisasAnteriores(top9);
          try { localStorage.setItem('pesquisasAnteriores', JSON.stringify(top9)); } catch(e){}
        })
        .catch((err) => {
          console.error('Erro ao buscar dados reais:', err);
          setResultado(null);
        });
    }
  };

  // Função para o botão "Limpar consulta" que você colocou no design
  const limparConsulta = () => {
    setResultado(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <img src="/Logo.svg" alt="Inoa logo" className="header-icon" />
          <h1>Inoa - B3 Tracker</h1>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="header-toggle"
            onClick={() => setUsarDadosMock((prev) => !prev)}
          >
            <img src="/swap.svg" alt="Alternar fonte de dados" className="header-toggle-icon" />
            {usarDadosMock ? 'DADOS SIMULADOS' : 'DADOS REAIS'}
          </button>
        </div>
      </header>
      
      <main className="app-main">
        <div className="sidebar">
          <FormularioCotacao onBuscar={lidarComBusca} listaAtivos={listaAtivos} setListaAtivos={setListaAtivos} />
          
          {/* Botão de limpar baseado no seu print */}
          <button onClick={limparConsulta} className="btn-limpar">
            Limpar consulta
          </button>
          
          <div className="historico-container">
            <p className="historico-titulo">Pesquisas Anteriores:</p>
            <div className="tags-container">
              {pesquisasAnteriores.slice(0,9).map((ativo) => (
                <button
                  key={ativo}
                  type="button"
                  className="tag-ativo"
                  onClick={() => {
                    setListaAtivos(prev => prev.includes(ativo) ? prev : [...prev, ativo]);
                  }}
                >
                  {ativo}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="content-panel">
          <GraficoCotacao resultado={resultado} />
        </div>
      </main>
    </div>
  );
}

export default App;