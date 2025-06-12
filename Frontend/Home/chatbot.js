const inputMensagem = document.getElementById("mensagem");
const chatDiv = document.getElementById("chat");
const clearButton = document.getElementById("clear-button");

// Recupera histórico salvo ao iniciar
window.onload = () => {
    const historico = localStorage.getItem("chatHistorico");
    if (historico) {
        chatDiv.innerHTML = historico;
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }
};

// Adiciona mensagem ao chat
function adicionarMensagem(tipo, texto) {
    const msg = document.createElement("div");
    msg.classList.add("mensagem", tipo);
    msg.innerText = texto;
    chatDiv.appendChild(msg);
    chatDiv.scrollTop = chatDiv.scrollHeight;
    salvarHistorico();
}

// Adiciona mensagem de loading
function mostrarLoading() {
    const loading = document.createElement("div");
    loading.id = "loading";
    loading.classList.add("mensagem", "bot");
    loading.innerText = "EcoBot está digitando...";
    chatDiv.appendChild(loading);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Remove mensagem de loading
function removerLoading() {
    const loading = document.getElementById("loading");
    if (loading) {
        chatDiv.removeChild(loading);
    }
}

// Envia a mensagem
function enviarMensagem() {
    const mensagem = inputMensagem.value.trim();
    if (!mensagem) return;

    adicionarMensagem("usuario", mensagem);
    inputMensagem.value = "";

    mostrarLoading();

    fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mensagem: mensagem })
    })
    .then(res => res.json())
    .then(data => {
        removerLoading();
        if (data.resposta) {
            adicionarMensagem("bot", data.resposta);
        } else {
            adicionarMensagem("bot", "Desculpe, não consegui entender.");
        }
    })
    .catch(() => {
        removerLoading();
        adicionarMensagem("bot", "Erro ao se comunicar com o servidor.");
    });
}

// Salva o histórico no localStorage
function salvarHistorico() {
    localStorage.setItem("chatHistorico", chatDiv.innerHTML);
}

// Limpa o histórico
clearButton.addEventListener("click", () => {
    chatDiv.innerHTML = "";
    localStorage.removeItem("chatHistorico");
});

// Enviar ao pressionar Enter
inputMensagem.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        enviarMensagem();
    }
});
