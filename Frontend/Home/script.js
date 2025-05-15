async function carregarDados() {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/dados');
    if (!response.ok) throw new Error('Erro ao carregar dados da API');
    const dados = await response.json();

    const turnos = [...new Set(dados.map(item => item.turno))];
    const materiais = [...new Set(dados.map(item => item.tipo_material))];

    const eficienciaPorTurno = {};
    turnos.forEach(turno => {
      eficienciaPorTurno[turno] = [];
    });

    const datas = [];
    const eficiencias = [];

    let erroPlasticoComoMetal = 0;
    let erroMetalComoPlastico = 0;

    const temposMedios = dados.map(item =>
      item.total_processado > 0
        ? item.tempo_total_processamento / item.total_processado
        : 0
    );

    const maxTempo = Math.max(...temposMedios);
    const labels = Array.from(
      { length: Math.ceil(maxTempo) + 1 },
      (_, i) => `${i}-${i + 1}`
    );
    const bins = Array(labels.length).fill(0);
    temposMedios.forEach(tempo => {
      const indice = Math.min(Math.floor(tempo), labels.length - 1);
      bins[indice]++;
    });

    const agrupado = {};
    turnos.forEach(turno => {
      agrupado[turno] = {};
      materiais.forEach(material => {
        agrupado[turno][material] = [];
      });
    });

    dados.forEach(item => {
      const turno = item.turno;
      const eficiencia = (item.corretamente_separado / item.total_processado) * 100;
      eficienciaPorTurno[turno].push(eficiencia);
      const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR');
      datas.push(dataFormatada);
      eficiencias.push(eficiencia.toFixed(2));

      erroPlasticoComoMetal += parseInt(item.erro_plastico_como_metal) || 0;
      erroMetalComoPlastico += parseInt(item.erro_metal_como_plastico) || 0;

      const material = item.tipo_material;
      if (!turnos.includes(turno) || !materiais.includes(material)) return;
      const taxaErro = item.total_processado > 0
        ? (item.mal_separado / item.total_processado) * 100
        : 0;
      agrupado[turno][material].push(taxaErro);
    });

    const pontosDispersao = dados
      .filter(item => item.total_processado > 0 && item.umidade !== null)
      .map(item => ({
        x: item.umidade,
        y: (item.mal_separado / item.total_processado) * 100
      }));

    gerarGraficoBarrasEficiência(eficienciaPorTurno);
    gerarGraficoLinhaEvolucao(datas, eficiencias);
    gerarGraficoPizzaErros(erroPlasticoComoMetal, erroMetalComoPlastico);
    gerarhistograma(labels, bins);
    gerarheatmap(agrupado, turnos, materiais);
    gerarGraficoDispersao(pontosDispersao);
  } catch (error) {
    console.error('Erro:', error);
    alert('Não foi possível carregar os dados. Verifique a API.');
  }
}

function gerarGraficoBarrasEficiência(eficienciaPorTurno) {
  const turnos = Object.keys(eficienciaPorTurno);
  const medias = turnos.map(turno => {
    const lista = eficienciaPorTurno[turno];
    const soma = lista.reduce((acc, val) => acc + val, 0);
    return (soma / lista.length).toFixed(2);
  });

  const ctx = document.getElementById('graficoeficiencia').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: turnos,
      datasets: [{
        label: 'Eficiência Média de Separação (%)',
        data: medias,
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
        borderRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Eficiência Média por Turno',
          font: { size: 18 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: 'Eficiência (%)' }
        },
        x: { title: { display: true, text: 'Turno' } }
      }
    }
  });
}

function gerarGraficoLinhaEvolucao(datas, eficiencias) {
  const ctx = document.getElementById('graficoevolucao').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: datas,
      datasets: [{
        label: 'Eficiência (%)',
        data: eficiencias,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#4CAF50'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Evolução da Eficiência no Tempo',
          font: { size: 18 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: 'Eficiência (%)' }
        },
        x: { title: { display: true, text: 'Data' } }
      }
    }
  });
}

function gerarGraficoPizzaErros(erroPlasticoComoMetal, erroMetalComoPlastico) {
  const ctx = document.getElementById('graficoErros').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Plástico como Metal', 'Metal como Plástico'],
      datasets: [{
        data: [erroPlasticoComoMetal, erroMetalComoPlastico],
        backgroundColor: ['#F44336', '#FFC107'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Distribuição dos Erros de Classificação',
          font: { size: 18 }
        }
      }
    }
  });
}

function gerarhistograma(labels, bins) {
  const ctx = document.getElementById('histogramaChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Frequência de Tempo Médio (seg/item)',
        data: bins,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Frequência' } },
        x: { title: { display: true, text: 'Tempo Médio (seg/item)' } }
      }
    }
  });
}

function gerarheatmap(agrupado, turnos, materiais) {
  const z = turnos.map(turno => {
    return materiais.map(material => {
      const lista = agrupado[turno][material];
      if (lista.length === 0) return null;
      const media = lista.reduce((a, b) => a + b, 0) / lista.length;
      return parseFloat(media.toFixed(2));
    });
  });

  const data = [{
    z: z,
    x: materiais,
    y: turnos,
    type: 'heatmap',
    colorscale: 'Reds',
    hoverongaps: false
  }];

  const layout = {
    title: {
      text: 'Taxa de Erro (%) por Turno e Tipo de Material',
      automargin: true,
      font: { size: 16 }
    },
    xaxis: {
      title: 'Tipo de Material',
      showgrid: false,
      automargin: true,
      tickfont: { size: 12 }
    },
    yaxis: {
      title: 'Turno',
      showgrid: false,
      automargin: true,
      tickfont: { size: 12 }
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    autosize: true,
    margin: {
      l: 40,
      r: 40,
      b: 40,
      t: 40,
      pad: 4
    }
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['toImage', 'lasso2d', 'select2d']
  };

  Plotly.newPlot('heatmap', data, layout, config);

  window.addEventListener('resize', () => {
    Plotly.Plots.resize(document.getElementById('heatmap'));
  });
}

function gerarGraficoDispersao(pontos) {
  const ctx = document.getElementById('graficoDispersao').getContext('2d');
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Umidade x Taxa de Erro (%)',
        data: pontos,
        backgroundColor: 'rgba(255, 99, 132, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Correlação: Umidade dos Materiais vs Taxa de Erro',
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Umidade: ${context.raw.x}%, Erro: ${context.raw.y.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        x: { title: { display: true, text: 'Umidade (%)' } },
        y: {
          title: { display: true, text: 'Taxa de Erro (%)' },
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

function mudarMonitoramento() {
  window.location.href = "monitoramento.html";
}

function mudarDashboard() {
  window.location.href = "dashboard.html";
}

function mudarChatbot() {
  window.location.href = "chatbot.html";
}

function mudarLogin() {
  window.location.href = "loginCadastro.html";
}

function trocarMaterial() {
  let dropdown = event.target.nextElementSibling;
  dropdown.classList.toggle('active');
}

function trocarTurno() {
  let dropdown = event.target.nextElementSibling;
  dropdown.classList.toggle('active');
}

function trocarData() {
  let dropdown = event.target.nextElementSibling;
  dropdown.classList.toggle('active');
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

carregarDados();