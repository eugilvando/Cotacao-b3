export function gerarDadosCotacao({ ativos, dataInicio, dataFim }) {
  const listaAtivos = ativos.split(',')
    .map(ativo => ativo.trim().toUpperCase())
    .filter(ativo => ativo.length > 0);

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const dadosGrafico = [];
  const cardsResumo = {};

  // Inicializa o controle de mínimas e máximas para cada ativo
  listaAtivos.forEach((ativo, index) => {
    cardsResumo[ativo] = {
      nome: ativo,
      precos: [],
      min: Infinity,
      max: -Infinity
    };
  });

  // Loop para gerar os preços dia a dia
  let dataAtual = new Date(inicio);
  while (dataAtual <= fim) {
    const day = String(dataAtual.getDate()).padStart(2, '0');
    const month = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const year = dataAtual.getFullYear();
    const dataFormatada = `${day}-${month}-${year}`; // Formato DD-MM-YYYY igual ao seu print
    
    const registroDia = { name: dataFormatada };

    listaAtivos.forEach((ativo, index) => {
      const precoBase = 30 + (index * 12); 
      const variacao = (Math.random() - 0.5) * 6;
      const precoFinal = parseFloat((precoBase + variacao).toFixed(2));
      
      registroDia[ativo] = precoFinal;

      // Guarda os preços para calcular as estatísticas do card
      cardsResumo[ativo].precos.push(precoFinal);
      if (precoFinal < cardsResumo[ativo].min) cardsResumo[ativo].min = precoFinal;
      if (precoFinal > cardsResumo[ativo].max) cardsResumo[ativo].max = precoFinal;
    });

    dadosGrafico.push(registroDia);
    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  // Monta a estrutura final de cada card
  const listaCards = listaAtivos.map(ativo => {
    const precosArr = cardsResumo[ativo].precos;
    const precoAtual = precosArr[precosArr.length - 1];
    const precoInicial = precosArr[0];
    
    // Calcula a variação percentual do período
    const variacaoPercentual = parseFloat((((precoAtual - precoInicial) / precoInicial) * 100).toFixed(2));
    const subiu = variacaoPercentual >= 0;

    return {
      ativo,
      precoAtual,
      variacaoPercentual: Math.abs(variacaoPercentual),
      subiu,
      min: cardsResumo[ativo].min,
      max: cardsResumo[ativo].max
    };
  });

  return {
    dadosParaOGrafico: dadosGrafico,
    ativosDetectados: listaAtivos,
    cards: listaCards,
    periodoTexto: `Da: ${dataInicio.split('-').reverse().join('/')} - Até: ${dataFim.split('-').reverse().join('/')}`
  };
}