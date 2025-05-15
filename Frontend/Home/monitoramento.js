async function executarCodigos() {
    try {
        
        const response = await fetch('http://127.0.0.1:5000/api/dados');
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const dados = await response.json();
        const esteira_lig = dados[0].esteira_lig;
        const atuadores = dados[0].atuadores

        document.getElementById('esteiras_lig').innerText = esteira_lig ? 'Ligada' : 'Desligada';
        document.getElementById('atuadores').innerText = atuadores ? 'Ligada' : 'Desligada';

        if(esteira_lig === false){
            document.getElementById('esteiras_lig').className = "status_off"
        }
        if(atuadores === false){
            document.getElementById('atuadores').className = "status_off"
        }
    } catch (error) {
        console.error('Erro ao tentar sincronizar a API:', error.message);
        document.getElementById('esteiras_lig').innerText = 'Erro ao carregar dados';
    }
    
}

executarCodigos();