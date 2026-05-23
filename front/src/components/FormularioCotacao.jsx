import React, { useState } from 'react';

function FormularioCotacao({ onBuscar }) {
  const [inputValue, setInputValue] = useState('');
  const [listaAtivos, setListaAtivos] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Função executada quando o usuário digita no input
  const handleKeyDown = (e) => {
    // Se pressionar Vírgula ou Enter
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      
      const novoAtivo = inputValue.trim().toUpperCase().replace(',', '');
      
      // Valida se não está vazio e se já não foi adicionado antes
      if (novoAtivo && !listaAtivos.includes(novoAtivo)) {
        setListaAtivos([...listaAtivos, novoAtivo]);
      }
      setInputValue(''); // Limpa o campo para a próxima digitação
    }
  };

  // Remove uma tag específica ao clicar no "×"
  const removerAtivo = (ativoParaRemover) => {
    setListaAtivos(listaAtivos.filter(ativo => ativo !== ativoParaRemover));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listaAtivos.length === 0) {
      alert("Por favor, adicione pelo menos um ativo pressionando Enter ou vírgula.");
      return;
    }
    // Passa a lista limpa e formatada como texto para o nosso gerador mock antigo continuar funcionando
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
        <div className="form-group">
          <label>Ativos (separados por vírgula)</label>
          <input 
            type="text" 
            className="input-text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={listaAtivos.length === 0 ? "Ex.: PETR4, VALE3 (Aperte Enter)" : "Adicione mais..."}
          />
          <p className="form-hint">Adicione uma vírgula ou pressione Enter para incluir um ativo.</p>
          
          {/* EXIBIÇÃO DAS TAGS LOGO ABAIXO DO INPUT CONFORME SEU PRINT */}
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