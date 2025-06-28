// Funções para alternar entre as abas de Login e Cadastro
const loginTab = document.querySelectorAll('.tab')[0];
const cadastroTab = document.querySelectorAll('.tab')[1];

console.log("cadastro tab:", cadastroTab);

let usuarios = [];

let usuarioCadastrados = JSON.parse(localStorage.getItem("usuarios")) || [];

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

    const usuarioCadastrados = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (!email || !senha) {
        document.getElementById("loginMessage").textContent = "❌ Preencha todos os campos.";
        return;
    }

    const usuarioEncontrado = usuarioCadastrados.find(
        (u) => u.email === email && u.senha === senha
    );

    if (usuarioEncontrado) {
        localStorage.setItem("usuarioLogado", JSON.stringify({ email }));
        document.getElementById("loginMessage").textContent = "✅ Login realizado com sucesso!";
        setTimeout(() => {
            window.location.href = "admin.html";
        }, 1000);
    } else {
        document.getElementById("loginMessage").textContent = "❌ Email e/ou senha inválidos.";
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

    usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.push({ email, senha });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    document.getElementById("cadastroMessage").textContent = "✅ Cadastro simulado com sucesso!";
    document.getElementById("cadastroEmail").value  = '';
    document.getElementById("cadastroSenha").value = '';
    document.getElementById("cadastroConfirma").value = '';

    mostrarLogin();

}

console.log(usuarios)
