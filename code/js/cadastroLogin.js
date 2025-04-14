// Funções para alternar entre as abas de Login e Cadastro
const loginTab = document.querySelectorAll('.tab')[0];
const cadastroTab = document.querySelectorAll('.tab')[1];

// Adiciona evento de clique para alternar entre as abas
function mostrarLogin() {
    loginTab.classList.add("active");
    cadastroTab.classList.remove("active");
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("cadastroForm").style.display = "none";
}

function mostrarCadastro() {
    cadastroTab.classList.add("active");
    loginTab.classList.remove("active");
    document.getElementById("cadastroForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
}

function fazerLogin() {
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    if (email && senha) {
    document.getElementById("loginMessage").textContent = "✅ Login realizado com sucesso!";
    // Simular delay antes do redirecionamento
    setTimeout(() => {
        window.location.href = "admin.html";
    }, 1000);
    } else {
    document.getElementById("loginMessage").textContent = "❌ Preencha todos os campos.";
    }
}

function fazerCadastro() {
    const email = document.getElementById("cadastroEmail").value;
    const senha = document.getElementById("cadastroSenha").value;
    const confirma = document.getElementById("cadastroConfirma").value;

    if (!email || !senha || !confirma) {
    document.getElementById("cadastroMessage").textContent = "❌ Preencha todos os campos.";
    return;
    }

    if (senha !== confirma) {
    document.getElementById("cadastroMessage").textContent = "❌ As senhas não coincidem.";
    return;
    }

    document.getElementById("cadastroMessage").textContent = "✅ Cadastro simulado com sucesso!";
}
