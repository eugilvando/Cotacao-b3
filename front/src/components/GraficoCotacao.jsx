import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip 
} from 'recharts';

function GraficoCotacao({ resultado }) {
  const [tipoGrafico, setTipoGrafico] = useState('bar');

  // ESTADO VAZIO: Substituindo o emoji pelo SVG oficial
  if (!resultado || resultado.dadosParaOGrafico.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-box">
          <img 
            src="/chart-bar.svg" 
            alt="Ícone de Gráfico" 
            className="empty-icon-svg" 
          />
        </div>
        <h2>Nenhum Resultado</h2>
        <p>Digite o código de uma ação (ex: PETR4) e clique em Buscar para ver o histórico de preços.</p>
      </div>
    );
  }

  const { dadosParaOGrafico, ativosDetectados, cards, periodoTexto } = resultado;
  const coresAtivos = ['#00bc7d', '#ff9500', '#4a90e2', '#a401ff', '#ff3b30'];

  return (
    <div className="dashboard-results">
      
      {/* Fileira de Cards de Resumo */}
      <div className="cards-row">
        {cards.map((card, index) => (
          <div key={card.ativo} className="summary-card">
            <span className="card-ticker">{card.ativo}</span>
            <h3 className="card-price">R$ {card.precoAtual.toString().replace('.', ',')}</h3>
            
            <div className={`card-trend ${card.subiu ? 'trend-up' : 'trend-down'}`}>
              {card.subiu ? '↗' : '↘'} {card.variacaoPercentual.toString().replace('.', ',')}% no período
            </div>
            
            <div className="card-min-max">
              <span>Min R$ {card.min.toString().replace('.', ',')}</span>
              <span>Max R$ {card.max.toString().replace('.', ',')}</span>
            </div>
            <div className="card-footer-bar" style={{ backgroundColor: coresAtivos[index % coresAtivos.length] }}></div>
          </div>
        ))}
      </div>

      {/* Card do Gráfico */}
      <div className="grafico-card">
        <div className="grafico-header">
          <div className="grafico-titles">
            <h2>Resultados</h2>
            <span className="grafico-subtitle-date">{periodoTexto}</span>
          </div>

          {/* BOTÃO DE TOGGLE ALINHADO À DIREITA (Tags removidas daqui) */}
          <div className="toggle-container">
            <button 
              className={`toggle-btn ${tipoGrafico === 'bar' ? 'active' : ''}`}
              onClick={() => setTipoGrafico('bar')}
            >
              Barras
            </button>
            <button 
              className={`toggle-btn ${tipoGrafico === 'line' ? 'active' : ''}`}
              onClick={() => setTipoGrafico('line')}
            >
              Linhas
            </button>
          </div>
        </div>

        {/* Gráfico Dinâmico */}
        <ResponsiveContainer width="100%" height={340}>
          {tipoGrafico === 'bar' ? (
            <BarChart data={dadosParaOGrafico} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" stroke="#999999" tickLine={false} style={{ fontSize: '11px' }} />
              <YAxis stroke="#999999" tickLine={false} axisLine={false} style={{ fontSize: '11px' }} tickFormatter={(v) => `R$ ${v}`} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              
              {ativosDetectados.map((ativo, index) => (
                <Bar 
                  key={ativo} 
                  dataKey={ativo} 
                  fill={coresAtivos[index % coresAtivos.length]} 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={15}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={dadosParaOGrafico} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" stroke="#999999" tickLine={false} style={{ fontSize: '11px' }} />
              <YAxis stroke="#999999" tickLine={false} axisLine={false} style={{ fontSize: '11px' }} tickFormatter={(v) => `R$ ${v}`} />
              <Tooltip />
              
              {ativosDetectados.map((ativo, index) => (
                <Line 
                  key={ativo} 
                  type="monotone"
                  dataKey={ativo} 
                  stroke={coresAtivos[index % coresAtivos.length]} 
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
        
        {/* Legenda Customizada na base */}
        <div className="custom-legend">
          {ativosDetectados.map((ativo, index) => (
            <div key={ativo} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: coresAtivos[index % coresAtivos.length] }}></span>
              <span className="legend-text">{ativo}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default GraficoCotacao;