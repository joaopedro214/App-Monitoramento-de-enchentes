src="https://code.jquery.com/jquery-3.6.4.min.js"
src="https://cdn.jsdelivr.net/npm/chart.js"
let grafico;

// const bairrosPorCidade = {
//   'Cidade A': ['Centro', 'Jardim das Flores', 'Vila Nova'],
//   'Cidade B': ['Bairro Azul', 'Colinas', 'Estação']
// };

const mockDadosAPI = [
    {
        cidade: "Cidade A",
        bairros: ["Centro", "Jardim das Flores", "Vila Nova"]
    },
    {
        cidade: "Cidade B",
        bairros: ["Bairro Azul", "Colinas", "Estação"]
    },
    {
        cidade: "Cidade C",
        bairros: ["Boa Vista", "Morro Alto", "Planalto"]
    }
];

function carregarCidades() {
    $('#cidade').empty().append('<option value="">Selecione uma cidade</option>');
    mockDadosAPI.forEach(item => {
        $('#cidade').append(`<option value="${item.cidade}">${item.cidade}</option>`);
    });
}

// $('#cidade').on('change', function () {
//   const cidadeSelecionada = $(this).val();
//   const bairros = bairrosPorCidade[cidadeSelecionada] || [];
//   $('#bairro').empty().append('<option value="">Selecione um bairro</option>');
//   bairros.forEach(bairro => {
//     $('#bairro').append(`<option value="${bairro}">${bairro}</option>`);
//   });
// });

$('#cidade').on('change', function () {
    const cidadeSelecionada = $(this).val();
    const cidadeInfo = mockDadosAPI.find(item => item.cidade === cidadeSelecionada);
    
    $('#bairro').empty().append('<option value="">Selecione um bairro</option>');
    
    if (cidadeInfo) {
        cidadeInfo.bairros.forEach(bairro => {
        $('#bairro').append(`<option value="${bairro}">${bairro}</option>`);
        });
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

$(document).ready(function () {
    carregarCidades();

    $('#consultar').on('click', atualizarMonitoramento);

    setInterval(() => {
        if ($('#cidade').val() && $('#bairro').val()) {
        atualizarMonitoramento();
        }
    }, 10000);
});

// $(document).ready(function () {
//   $('#consultar').on('click', atualizarMonitoramento);
//   setInterval(() => {
//     if ($('#cidade').val() && $('#bairro').val()) {
//       atualizarMonitoramento();
//     }
//   }, 10000);
// });
