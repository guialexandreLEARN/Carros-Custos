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

    // Verificação de autenticação
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('Usuário logado:', user.email);
            document.getElementById('forms').style.display = 'block'; // Mostra os formulários após o login
            document.getElementById('logoutButton').style.display = 'block'; // Mostra o botão de logout
        } else {
            console.log('Nenhum usuário logado');
            document.getElementById('forms').style.display = 'none'; // Esconde os formulários se o usuário deslogar
            document.getElementById('logoutButton').style.display = 'none'; // Esconde o botão de logout
        }
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
            }).catch((error) => {
                alert('Erro ao fazer logout: ' + error.message);
            });
        });
    } else {
        console.error("Elemento 'logoutButton' não encontrado.");
    }

    // Função para adicionar carro ao Firestore
    const carForm = document.getElementById('carForm');
    if (carForm) {
        carForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Previne o comportamento padrão de envio do formulário

            // Captura os valores do formulário
            const renavam = document.getElementById('renavam').value;
            const marca = document.getElementById('marca').value;
            const modelo = document.getElementById('modelo').value;
            const anoFab = document.getElementById('anoFab').value;
            const anoModelo = document.getElementById('anoModelo').value;
            const versao = document.getElementById('versao').value;
            const litragemMotor = document.getElementById('litragemMotor').value;
            const cor = document.getElementById('cor').value;
            const placaAntiga = document.getElementById('placaAntiga').value;
            const placaMercosul = document.getElementById('placaMercosul').value;
            const codigoFIPE = document.getElementById('codigoFIPE').value;

            // Salva os dados do carro no Firestore
            db.collection('Caracteristicas').add({
                RENAVAM: renavam,
                Marca: marca,
                Modelo: modelo,
                Ano_Fab: anoFab,
                Ano_Modelo: anoModelo,
                Versao: versao,
                Litragem_Motor: litragemMotor,
                Cor: cor,
                Placa_Antiga: placaAntiga,
                Placa_Mercosul: placaMercosul,
                Codigo_FIPE: codigoFIPE
            })
            .then(() => {
                alert('Carro adicionado com sucesso!');
                carForm.reset(); // Limpa o formulário após o envio
            })
            .catch((error) => {
                alert('Erro ao adicionar carro: ' + error.message);
            });
        });
    } else {
        console.error("Elemento 'carForm' não encontrado.");
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
            db.collection('Custos').add({
                RENAVAM_Custo: renavamCusto,
                Descricao_Custos: descricaoCustos,
                Quem_Pagou: quemPagou,
                Metodo_Pagamento: metodoPagamento,
                Valor_Custos: valorCustos
            })
            .then(() => {
                alert('Custo adicionado com sucesso!');
                costForm.reset(); // Limpa o formulário após o envio
            })
            .catch((error) => {
                alert('Erro ao adicionar custo: ' + error.message);
            });
        });
    } else {
        console.error("Elemento 'costForm' não encontrado.");
    }
});
