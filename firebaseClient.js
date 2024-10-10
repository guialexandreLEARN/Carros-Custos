document.addEventListener('DOMContentLoaded', function() {

    // Configuração do Firebase (frontend)
    const firebaseConfig = {
        apiKey: "AIzaSyCWT72-XVlMkIBU64KhAbeZhaykRfln5As",
        authDomain: "vendascarro-estudo.firebaseapp.com",
        projectId: "vendascarro-estudo",
        storageBucket: "vendascarro-estudo.appspot.com",
        messagingSenderId: "1065254193744",
        appId: "1:1065254193744:web:0154a1cb974c9658c19f55",
        measurementId: "G-ME5MH151S1"
    };

    // Inicializando o Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Definir a persistência de login para 'local' (persistência no navegador)
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            console.log("Persistência de autenticação definida para 'local'.");
        })
        .catch((error) => {
            console.error("Erro ao definir a persistência de autenticação:", error);
        });

    // Função de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Previne o comportamento padrão do envio do formulário
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    console.log('Usuário logado: ', userCredential.user.email);
                    alert('Login realizado com sucesso!');
                    document.getElementById('forms').style.display = 'block'; // Mostra os formulários após o login
                    document.getElementById('logoutButton').style.display = 'block'; // Mostra o botão de logout
                })
                .catch((error) => {
                    alert('Erro ao fazer login: ' + error.message);
                });
        });
    } else {
        console.error("Elemento 'loginForm' não encontrado.");
    }

    // Função de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            auth.signOut().then(() => {
                alert('Logout realizado com sucesso!');
                document.getElementById('forms').style.display = 'none'; // Esconde os formulários após o logout
                document.getElementById('logoutButton').style.display = 'none'; // Esconde o botão de sair
            }).catch((error) => {
                alert('Erro ao fazer logout: ' + error.message);
            });
        });
    } else {
        console.error("Elemento 'logoutButton' não encontrado.");
    }

    // Função para adicionar custo
    const costForm = document.getElementById('costForm');
    if (costForm) {
        costForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Previne o comportamento padrão de envio do formulário

            // Captura os valores do formulário
            const renavamCusto = document.getElementById('renavamCusto').value;
            const descricaoCustos = document.getElementById('descricaoCustos').value;
            const quemPagou = document.getElementById('quemPagou').value;
            const metodoPagamento = document.getElementById('metodoPagamento').value;
            const valorCustos = document.getElementById('valorCustos').value;

            // Aqui você pode adicionar lógica para salvar os dados no Firebase ou onde necessário
            console.log("Dados do custo:", {
                renavamCusto,
                descricaoCustos,
                quemPagou,
                metodoPagamento,
                valorCustos
            });

            // Feedback ao usuário
            alert('Custo adicionado com sucesso!');
            costForm.reset(); // Limpa o formulário após o envio
        });
    } else {
        console.error("Elemento 'costForm' não encontrado.");
    }

    // Funções para editar e excluir custo (apenas como placeholders)
    const editCostButton = document.getElementById('editCostButton');
    if (editCostButton) {
        editCostButton.addEventListener('click', function() {
            alert('Função de editar custo em desenvolvimento.');
        });
    } else {
        console.error("Elemento 'editCostButton' não encontrado.");
    }

    const deleteCostButton = document.getElementById('deleteCostButton');
    if (deleteCostButton) {
        deleteCostButton.addEventListener('click', function() {
            alert('Função de excluir custo em desenvolvimento.');
        });
    } else {
        console.error("Elemento 'deleteCostButton' não encontrado.");
    }

});
