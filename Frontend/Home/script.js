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

    // Agregar eficiência por data
    const eficienciaPorData = {};
    dados.forEach(item => {
      const turno = item.turno;
      const eficiencia = (item.corretamente_separado / item.total_processado) * 100;
      eficienciaPorTurno[turno].push(eficiencia);
      const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR');

      if (!eficienciaPorData[dataFormatada]) {
        eficienciaPorData[dataFormatada] = [];
      }
      eficienciaPorData[dataFormatada].push(eficiencia);
    });

    // Calcular média de eficiência por data
    const datas = Object.keys(eficienciaPorData);
    const eficiencias = datas.map(data => {
      const valores = eficienciaPorData[data];
      return valores.reduce((a, b) => a + b, 0) / valores.length;
    });

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
      const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR');

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
    gerarheatmap(agrupado, turnos, materiais);

    const totalCorretamenteSeparado = dados.reduce((soma, item) => soma + item.corretamente_separado, 0);
    const totalProcessado = dados.reduce((soma, item) => soma + item.total_processado, 0);
    const eficienciaTotal = totalProcessado > 0 ? (totalCorretamenteSeparado / totalProcessado) * 100 : 0;
    gerarGraficoDonutEficienciaTotal(eficienciaTotal);
    
  } catch (error) {
    console.error('Erro:', error);
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
        data: medias,
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
        borderRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
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

function gerarGraficoDonutEficienciaTotal(eficienciaTotal) {
  const ctx = document.getElementById('graficoEficienciaTotal').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Eficiência', 'Ineficiência'],
      datasets: [{
        data: [eficienciaTotal, 100 - eficienciaTotal],
        backgroundColor: ['blue', '#DCDCDC'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Eficiência Total da Produção',
          font: { size: 18 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value.toFixed(2)}%`;
            }
          }
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

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

carregarDados();

  chat.innerHTML += `<div class="mensagem bot">Bot: ${data.resposta}</div>`;
  input.value = '';
