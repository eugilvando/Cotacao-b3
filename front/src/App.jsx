import React, { useState } from 'react';
import FormularioCotacao from './components/FormularioCotacao';
import GraficoCotacao from './components/GraficoCotacao';
import { gerarDadosCotacao } from './mock/geradorMock';
import './App.css';

function App() {
  // Iniciamos como null para exibir a tela de "Nenhum Resultado"
  const [resultado, setResultado] = useState(null);
  const [usarDadosMock, setUsarDadosMock] = useState(true);
  const pesquisasAnteriores = ['PETR4', 'VALE3', 'ITUB4', 'MGLU3', 'BEEF3', 'UGPA3'];

  const lidarComBusca = (filtros) => {
    if (usarDadosMock) {
      // Dispara o gerador mock com os dados reais digitados na tela
      const dadosGerados = gerarDadosCotacao(filtros);
      setResultado(dadosGerados);
    } else {
      // TODO: implementar requisição ao backend
      setResultado(null);
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
          <FormularioCotacao onBuscar={lidarComBusca} />
          
          {/* Botão de limpar baseado no seu print */}
          <button onClick={limparConsulta} className="btn-limpar">
            Limpar consulta
          </button>
          
          <div className="historico-container">
            <p className="historico-titulo">Pesquisas Anteriores:</p>
            <div className="tags-container">
              {pesquisasAnteriores.map((ativo) => (
                <span key={ativo} className="tag-ativo">{ativo}</span>
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