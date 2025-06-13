async function executarCodigos() {
    try {
        console.log("Tentando conectar a http://127.0.0.1:5000/api/dados...");
        const response = await fetch(`http://127.0.0.1:5000/api/dados?t=${new Date().getTime()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        const dados = await response.json();
        console.log("Dados recebidos:", dados);

        const dado = dados[0] || {};
        console.log("Dado selecionado:", dado);

        document.getElementById('esteira_lig').innerText = dado.esteira_lig ? 'Ligada' : 'Desligada';
        document.getElementById('esteira_lig').className = dado.esteira_lig ? 'status' : 'status_off';

        document.getElementById('atuador1').innerText = dado.atuador1 ? 'Ligada' : 'Desligada';
        document.getElementById('atuador1').className = dado.atuador1 ? 'status' : 'status_off';

        document.getElementById('atuador2').innerText = dado.atuador2 ? 'Ligada' : 'Desligada';
        document.getElementById('atuador2').className = dado.atuador2 ? 'status' : 'status_off';

        document.getElementById('tempoLigada').innerText = dado.tempoLigada || 'N/A';
        document.getElementById('ultimaParada').innerText = dado.ultimaParada || 'N/A';
        document.getElementById('erros').innerText = dado.erros !== undefined ? dado.erros : 0;

    } catch (error) {
        console.error('Erro ao tentar sincronizar a API:', error.message);
        const elementos = [
            { id: 'esteira_lig', texto: 'Erro ao carregar dados', classe: 'status_off' },
            { id: 'atuador1', texto: 'Erro ao carregar dados', classe: 'status_off' },
            { id: 'atuador2', texto: 'Erro ao carregar dados', classe: 'status_off' },
            { id: 'tempoLigada', texto: 'Erro ao carregar dados', classe: '' },
            { id: 'ultimaParada', texto: 'Erro ao carregar dados', classe: '' },
            { id: 'erros', texto: 'Erro ao carregar dados', classe: '' }
        ];

        elementos.forEach(({ id, texto, classe }) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.innerText = texto;
                if (classe) elemento.className = classe;
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    executarCodigos(); 
    setInterval(executarCodigos, 2000); 
});