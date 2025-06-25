src="https://code.jquery.com/jquery-3.6.4.min.js"
src="https://cdn.jsdelivr.net/npm/chart.js"
let grafico;

/* const bairrosPorCidade = {
  'Cidade A': ['Centro', 'Jardim das Flores', 'Vila Nova'],
  'Cidade B': ['Bairro Azul', 'Colinas', 'Estação']
}; */

// Função para limpar dados antigos e forçar nova estrutura
function limparDadosAntigos() {
    localStorage.removeItem('dadosCidades');
}

// Função para migrar dados antigos para nova estrutura
function migrarDadosAntigos(dados) {
    if (!Array.isArray(dados) || dados.length === 0) return dados;
    
    // Verifica se os dados estão na estrutura antiga (com arrays)
    const primeiroItem = dados[0];
    if (primeiroItem.bairros && Array.isArray(primeiroItem.bairros)) {
        const novosDados = [];
        dados.forEach(cidade => {
            if (cidade.bairros && cidade.niveis) {
                cidade.bairros.forEach(bairro => {
                    novosDados.push({
                        cidade: cidade.cidade,
                        bairro: bairro,
                        nivel: cidade.niveis[bairro] || 0
                    });
                });
            }
        });
        
        // Salva os dados migrados
        localStorage.setItem('dadosCidades', JSON.stringify(novosDados));
        return novosDados;
    }
    
    return dados;
}

// Função para obter dados do localStorage
function obterDadosCidades() {
    const dadosSalvos = localStorage.getItem('dadosCidades');
    const dados = dadosSalvos ? JSON.parse(dadosSalvos) : [];
    
    // Migra dados antigos se necessário
    const dadosMigrados = migrarDadosAntigos(dados);
    
    return dadosMigrados;
}

// Função para carregar cidades dinamicamente
function carregarCidades() {
    const dadosCidades = obterDadosCidades();
    
    $('#cidade').empty().append('<option value="">Selecione uma cidade</option>');
    
    if (dadosCidades.length === 0) {
        // Se não há dados, mostra mensagem
        $('#cidade').append('<option value="" disabled>Nenhuma cidade cadastrada</option>');
        $('#bairro').empty().append('<option value="">Selecione um bairro</option>');
        return;
    }
    
    // Adiciona cada cidade única
    const cidadesUnicas = [...new Set(dadosCidades.map(item => item.cidade))];
    cidadesUnicas.forEach(cidade => {
        $('#cidade').append(`<option value="${cidade}">${cidade}</option>`);
    });
}

// Função para carregar bairros de uma cidade específica
function carregarBairros(cidadeSelecionada) {
    const dadosCidades = obterDadosCidades();
    
    $('#bairro').empty().append('<option value="">Selecione um bairro</option>');
    
    if (cidadeSelecionada) {
        // Filtra os bairros da cidade selecionada
        const bairrosDaCidade = dadosCidades.filter(item => item.cidade === cidadeSelecionada);
        
        if (bairrosDaCidade.length > 0) {
            bairrosDaCidade.forEach(item => {
                if (item.bairro) {
                    $('#bairro').append(`<option value="${item.bairro}">${item.bairro}</option>`);
                }
            });
        } else {
            $('#bairro').append('<option value="" disabled>Nenhum bairro cadastrado</option>');
        }
    }
}

// Event listener para mudança de cidade
$(document).on('change', '#cidade', function () {
    const cidadeSelecionada = $(this).val();
    carregarBairros(cidadeSelecionada);
    
    // Limpa o resultado se mudar a cidade
    if (!cidadeSelecionada) {
        $('#resultado').empty();
        $('#graficoChuva').hide();
    }
});

// Event listener para mudança de bairro
$(document).on('change', '#bairro', function () {
    const bairroSelecionado = $(this).val();
    
    // Limpa o resultado se não selecionar bairro
    if (!bairroSelecionado) {
        $('#resultado').empty();
        $('#graficoChuva').hide();
    }
});

function simularDados(bairro) {
    const chuvaHoje = Math.floor(Math.random() * 100);
    const nivelRioHoje = (Math.random() * 6 + 1).toFixed(2);
    return { chuvaHoje, nivelRioHoje };
}

function atualizarMonitoramento() {
    const cidade = $('#cidade').val();
    const bairro = $('#bairro').val();
    
    if (!cidade || !bairro) {
        alert('Selecione uma cidade e um bairro.');
        return;
    }

    const dadosCidades = obterDadosCidades();
    const bairroInfo = dadosCidades.find(item => item.cidade === cidade && item.bairro === bairro);
    const nivelInicial = bairroInfo ? bairroInfo.nivel : 0;

    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const chuvaSemana = Array.from({ length: 7 }, () => Math.floor(Math.random() * 60));
    const { chuvaHoje, nivelRioHoje } = simularDados(bairro);
    const alertaChuva = chuvaHoje > 50;
    const alertaRio = nivelRioHoje >= 5.0;

    $('#resultado').html(`
    <h3>📍 ${cidade} - Bairro ${bairro}</h3>
    <div class="status-boxes">
        <div class="status-card status-chuva"><i>🌧️</i> Chuva hoje: <strong>${chuvaHoje} mm</strong></div>
        <div class="status-card status-rio"><i>🌊</i> Nível do Rio: <strong>${nivelRioHoje} m</strong></div>
        <div class="status-card status-nivel"><i>📊</i> Nível Inicial: <strong>${nivelInicial} m</strong></div>
        <div class="status-card ${alertaChuva || alertaRio ? 'status-alerta' : 'status-ok'}">
        <i>${alertaChuva || alertaRio ? '⚠️' : '✅'}</i> ${alertaChuva || alertaRio ? 'ALERTA DE ENCHENTE - Evite áreas de risco' : 'Sem risco no momento'}
        </div>
    </div>
    `);

    $('#graficoChuva').show();
    if (grafico) grafico.destroy();

    grafico = new Chart(document.getElementById('graficoChuva'), {
    type: 'bar',
    data: {
        labels: dias,
        datasets: [{
        label: 'Chuva (mm)',
        data: chuvaSemana,
        backgroundColor: '#0288d1'
        }]
    },
    options: {
        responsive: true,
        plugins: {
        legend: { display: false },
        title: {
            display: true,
            text: 'Chuva Acumulada - Últimos 7 dias'
        }
        },
        scales: {
        y: {
            beginAtZero: true,
            ticks: { stepSize: 10 }
        }
        }
    }
    });
}

// Função para verificar se há dados cadastrados
function verificarDadosCadastrados() {
    const dadosCidades = obterDadosCidades();
    if (dadosCidades.length === 0) {
        $('#resultado').html(`
            <div class="status-card status-info">
                <i>ℹ️</i> <strong>Nenhuma cidade cadastrada</strong><br>
                Acesse o painel administrativo para cadastrar cidades e bairros.
                <br><br>
                <a href="admin.html" class="btn-admin">🔧 Acessar Painel Admin</a>
            </div>
        `);
    }
}

// Função para atualizar dados em tempo real
function atualizarDadosEmTempoReal() {
    carregarCidades();
    
    // Se há uma cidade selecionada, recarrega os bairros
    const cidadeAtual = $('#cidade').val();
    if (cidadeAtual) {
        carregarBairros(cidadeAtual);
    }
}

$(document).ready(function () {
    // Limpa dados antigos na primeira execução
    if (localStorage.getItem('dadosCidades')) {
        const dadosAntigos = JSON.parse(localStorage.getItem('dadosCidades'));
        if (dadosAntigos.length > 0 && dadosAntigos[0].bairros) {
            limparDadosAntigos();
        }
    }
    
    carregarCidades();
    verificarDadosCadastrados();

    $('#consultar').on('click', atualizarMonitoramento);

    // Atualiza dados a cada 10 segundos se houver cidade e bairro selecionados
    setInterval(() => {
        if ($('#cidade').val() && $('#bairro').val()) {
            atualizarMonitoramento();
        }
    }, 10000);
    
    // Atualiza a lista de cidades quando a página ganha foco (útil após cadastros)
    $(window).on('focus', function() {
        atualizarDadosEmTempoReal();
    });
    
    // Atualiza dados quando a janela é visível novamente
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            atualizarDadosEmTempoReal();
        }
    });
});
