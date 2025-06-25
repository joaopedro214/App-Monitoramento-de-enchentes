// Arquivo JavaScript para funcionalidades do painel administrativo
// As funções principais estão inline no HTML para simplicidade

// Estrutura de dados para armazenar cidades e bairros
let dadosCidades = JSON.parse(localStorage.getItem('dadosCidades')) || [];

// Função para salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('dadosCidades', JSON.stringify(dadosCidades));
}

// Função para validar se um valor é um número válido
function validarNumero(valor) {
    const numero = parseFloat(valor);
    return !isNaN(numero) && numero >= 0;
}

// Função para carregar dados existentes na tabela
function carregarDadosExistentes() {
    const tabela = document.getElementById("tabela").getElementsByTagName("tbody")[0];
    tabela.innerHTML = ''; // Limpa a tabela
    
    dadosCidades.forEach(item => {
        const novaLinha = tabela.insertRow();
        novaLinha.insertCell(0).textContent = item.cidade;
        novaLinha.insertCell(1).textContent = item.bairro;
        novaLinha.insertCell(2).textContent = `${item.nivel} m`;
    });
}

// Função para adicionar bairro (estrutura simplificada)
function adicionarBairro() {
    const cidade = document.getElementById("cidade").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const nivel = document.getElementById("nivel").value.trim();

    if (cidade === "" || bairro === "" || nivel === "") {
        alert("Preencha todos os campos.");
        return;
    }

    // Valida se o nível é um número válido
    if (!validarNumero(nivel)) {
        alert("Por favor, insira um número válido para o nível de inundação.");
        return;
    }

    const nivelNumero = parseFloat(nivel);

    // Verifica se já existe este bairro nesta cidade
    const bairroExistente = dadosCidades.find(item => 
        item.cidade === cidade && item.bairro === bairro
    );
    
    if (bairroExistente) {
        alert("Este bairro já está cadastrado para esta cidade.");
        return;
    }

    // Adiciona o novo registro
    dadosCidades.push({
        cidade: cidade,
        bairro: bairro,
        nivel: nivelNumero
    });

    // Salva no localStorage
    salvarDados();
    
    // Atualiza a tabela
    carregarDadosExistentes();

    // Limpa os campos
    document.getElementById("cidade").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("nivel").value = "";
    
    alert("Bairro adicionado com sucesso!");
}

// Função para limpar todos os dados (útil para testes)
function limparTodosDados() {
    if (confirm("Tem certeza que deseja limpar todos os dados?")) {
        dadosCidades = [];
        localStorage.removeItem('dadosCidades');
        carregarDadosExistentes();
        alert("Todos os dados foram removidos!");
    }
}

// Função para exportar dados (útil para backup)
function exportarDados() {
    const dados = JSON.stringify(dadosCidades, null, 2);
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dados_cidades.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Carrega dados existentes quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    carregarDadosExistentes();
});
