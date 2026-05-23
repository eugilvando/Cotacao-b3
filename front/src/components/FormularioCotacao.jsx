import React, { useState } from 'react';

const ATIVOS_B3 = [
  "PETR3", "PETR4", "VALE3", "GGBR4", "CSNA3", "USIM5", "PRIO3",
  "ITUB4", "BBDC3", "BBDC4", "BBAS3", "SANB11", "ITSA4", "B3SA3"
];

function FormularioCotacao({ onBuscar, listaAtivos, setListaAtivos }) {
  const [inputValue, setInputValue] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  
  // 💡 ESTADO DO AUTOCOMPLETE: Guarda as sugestões encontradas
  const [sugestoes, setSugestoes] = useState([]);

  // 💡 LÓGICA DO AUTOCOMPLETE: Filtra a lista enquanto o usuário digita
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setInputValue(valor);

    if (valor.trim().length > 0) {
      const filtrados = ATIVOS_B3.filter(ativo =>
        ativo.toLowerCase().includes(valor.toLowerCase()) && 
        !listaAtivos.includes(ativo) // Não sugere o que já virou tag
      );
      setSugestoes(filtrados);
    } else {
      setSugestoes([]);
    }
  };

  // Função centralizada para criar a tag e limpar a busca
  const adicionarTag = (nomeAtivo) => {
    const ativoLimpo = nomeAtivo.trim().toUpperCase().replace(',', '');
    
    if (ativoLimpo && !listaAtivos.includes(ativoLimpo)) {
      setListaAtivos([...listaAtivos, ativoLimpo]);
    }
    setInputValue('');
    setSugestoes([]); // Fecha o menu flutuante
  };

  const handleKeyDown = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      adicionarTag(inputValue);
    }
  };

  const removerAtivo = (ativoParaRemover) => {
    setListaAtivos(listaAtivos.filter(ativo => ativo !== ativoParaRemover));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listaAtivos.length === 0) {
      alert("Por favor, adicione pelo menos um ativo pressionando Enter ou vírgula.");
      return;
    }
    onBuscar({ 
      ativos: listaAtivos.join(', '), 
      dataInicio, 
      dataFim 
    });
  };

  return (
    <div className="card-consulta">
      <h2 className="card-title">Consulta de Ações</h2>
      <div className="card-subtitle">
        Pesquise o histórico de preços de ações da bolsa brasileira
      </div>

      <form onSubmit={handleSubmit}>
        {/* Adicionado position relative para a lista flutuante não quebrar o layout */}
        <div className="form-group" style={{ position: 'relative' }}>
          <label>Ativos</label>
          <input 
            type="text" 
            className="input-text"
            value={inputValue}
            onChange={handleInputChange} // 👈 Agora monitora a digitação
            onKeyDown={handleKeyDown}
            placeholder={listaAtivos.length === 0 ? "Ex.: PETR4, VALE3 (Aperte Enter)" : "Adicione mais..."}
            autoComplete="off" // Desativa o histórico antigo do navegador
          />
          
          {/* 💡 CAIXA SUSPENSA DO AUTOCOMPLETE */}
          {sugestoes.length > 0 && (
            <ul className="autocomplete-dropdown">
              {sugestoes.map((ativo) => (
                <li 
                  key={ativo} 
                  onClick={() => adicionarTag(ativo)} // Transforma em tag ao clicar
                  className="autocomplete-item"
                >
                  {ativo}
                </li>
              ))}
            </ul>
          )}

          <p className="form-hint">Adicione uma vírgula ou pressione Enter para incluir um ativo.</p>
          
          {listaAtivos.length > 0 && (
            <div className="input-tags-wrapper">
              {listaAtivos.map((ativo) => (
                <span key={ativo} className="input-mini-tag">
                  {ativo} 
                  <button type="button" onClick={() => removerAtivo(ativo)} className="input-close-tag">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="datas-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Data Inicial</label>
            <input 
              type="date" 
              className="input-date"
              value={dataInicio} 
              onChange={(e) => setDataInicio(e.target.value)} 
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Data Final</label>
            <input 
              type="date" 
              className="input-date"
              value={dataFim} 
              onChange={(e) => setDataFim(e.target.value)} 
              required
            />
          </div>
        </div>
        
        <button type="submit" className="btn-consultar">
          <img src="/search.svg" alt="Ícone de Pesquisa" className="btn-icon-svg"/>
          Consultar
        </button>
      </form>
    </div>
  );
}

export default FormularioCotacao;