async function executarCodigos() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/dados', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        const dados = await response.json();
        
        const dado = dados[0] || {};

        document.getElementById('esteiras_lig').innerText = dado.esteira_lig ? 'Ligada' : 'Desligada';
        document.getElementById('esteiras_lig').className = dado.esteira_lig ? 'status' : 'status_off';

        document.getElementById('atuadores').innerText = dado.atuadores ? 'Ligada' : 'Desligada';
        document.getElementById('atuadores').className = dado.atuadores ? 'status' : 'status_off';

        document.getElementById('tempo_total_processamento').innerText = 
            dado.tempo_total_processamento ? `${dado.tempo_total_processamento} segundos` : 'N/A';

        document.getElementById('tempoLigada').innerText = dado.tempoLigada || 'N/A';

        document.getElementById('ultimaParada').innerText = dado.ultimaParada || 'N/A';

        document.getElementById('erros').innerText = dado.erros !== undefined ? dado.erros : 0;

    } catch (error) {
        console.error('Erro ao tentar sincronizar a API:', error.message);
        document.getElementById('esteiras_lig').innerText = 'Erro ao carregar dados';
        document.getElementById('esteiras_lig').className = 'status_off';
        document.getElementById('atuadores').innerText = 'Erro ao carregar dados';
        document.getElementById('atuadores').className = 'status_off';
        document.getElementById('tempo_total_processamento').innerText = 'Erro ao carregar dados';
        document.getElementById('tempoLigada').innerText = 'Erro ao carregar dados';
        document.getElementById('ultimaParada').innerText = 'Erro ao carregar dados';
        document.getElementById('erros').innerText = 'Erro ao carregar dados';
    }
}
executarCodigos();
setInterval(executarCodigos, 60000);
