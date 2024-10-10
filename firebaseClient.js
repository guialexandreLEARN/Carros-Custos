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
    const app = firebase.initializeApp(firebaseConfig);
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
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
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

    // Função de logout
    document.getElementById('logoutButton').addEventListener('click', function() {
        auth.signOut().then(() => {
            alert('Logout realizado com sucesso!');
            document.getElementById('forms').style.display = 'none'; // Esconde os formulários após o logout
            document.getElementById('logoutButton').style.display = 'none'; // Esconde o botão de sair
        }).catch((error) => {
            alert('Erro ao fazer logout: ' + error.message);
        });
    });

    // Verificação de autenticação
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('Usuário logado: ', user.email);
            document.getElementById('forms').style.display = 'block'; // Mostra os formulários se já estiver logado
            document.getElementById('logoutButton').style.display = 'block'; // Mostra o botão de logout se já estiver logado
        } else {
            console.log('Nenhum usuário logado');
        }
    });

    // Função para preencher datalists com dados distintos e ordenados alfabeticamente do Firestore
    async function preencherDatalist(idDatalist, collectionName, fieldName) {
        const querySnapshot = await db.collection(collectionName).get();
        const datalist = document.getElementById(idDatalist);
        const uniqueValues = new Set();  // Usar Set para armazenar valores únicos

        querySnapshot.forEach((doc) => {
            uniqueValues.add(doc.data()[fieldName]);  // Adicionar valores ao Set
        });

        // Converter o Set em um array e ordenar alfabeticamente
        const sortedValues = Array.from(uniqueValues).sort();

        // Adicionar os valores ao datalist
        sortedValues.forEach((value) => {
            const option = document.createElement('option');
            option.value = value;
            datalist.appendChild(option);
        });
    }

    // Preencher as listas de sugestões no formulário de "Adicionar Carro"
    preencherDatalist('renavamsCar', 'Caracteristicas', 'RENAVAM');
    preencherDatalist('marcas', 'Caracteristicas', 'Marca');
    preencherDatalist('modelos', 'Caracteristicas', 'Modelo');
    preencherDatalist('anosFabricacao', 'Caracteristicas', 'Ano_Fab');
    preencherDatalist('anosModelo', 'Caracteristicas', 'Ano_Modelo');
    preencherDatalist('versoes', 'Caracteristicas', 'Versao');
    preencherDatalist('litragensMotor', 'Caracteristicas', 'Litragem_Motor');
    preencherDatalist('cores', 'Caracteristicas', 'Cor');
    preencherDatalist('placasAntigas', 'Caracteristicas', 'Placa_Antiga');
    preencherDatalist('placasMercosul', 'Caracteristicas', 'Placa_Mercosul');
    preencherDatalist('codigosFIPE', 'Caracteristicas', 'Codigo_FIPE');

    // Preencher as listas de sugestões no formulário de "Adicionar Custo"
    preencherDatalist('renavamsCost', 'Custos', 'RENAVAM_Custo');
    preencherDatalist('descriptions', 'Custos', 'Descricao_Custos');
    preencherDatalist('quemPagouList', 'Custos', 'Quem_Pagou');
    preencherDatalist('paymentMethods', 'Custos', 'Metodo_Pagamento');

    // Função para buscar os dados do Firestore e preencher o formulário de carro
    async function buscarCarroPorRenavam(renavam) {
        const carroSnapshot = await db.collection('Caracteristicas').get();
        let carroEncontrado = null;

        carroSnapshot.forEach((doc) => {
            if (doc.data().RENAVAM === renavam) {
                carroEncontrado = doc.data();
            }
        });

        if (carroEncontrado) {
            // Preencher o formulário com os dados existentes
            document.getElementById('marca').value = carroEncontrado.Marca;
            document.getElementById('modelo').value = carroEncontrado.Modelo;
            document.getElementById('anoFab').value = carroEncontrado.Ano_Fab;
            document.getElementById('anoModelo').value = carroEncontrado.Ano_Modelo;
            document.getElementById('versao').value = carroEncontrado.Versao;
            document.getElementById('litragemMotor').value = carroEncontrado.Litragem_Motor;
            document.getElementById('cor').value = carroEncontrado.Cor;
            document.getElementById('placaAntiga').value = carroEncontrado.Placa_Antiga;
            document.getElementById('placaMercosul').value = carroEncontrado.Placa_Mercosul;
            document.getElementById('codigoFIPE').value = carroEncontrado.Codigo_FIPE;
        } else {
            document.getElementById('carForm').reset();
        }
    }

    // Ouvinte de evento para quando o usuário mudar o valor do RENAVAM no formulário de carro
    document.getElementById('renavam').addEventListener('change', function() {
        const renavam = document.getElementById('renavam').value;
        buscarCarroPorRenavam(renavam);
    });

    // Função para buscar os dados do Firestore e preencher o formulário de custo
    async function buscarCustoPorRenavam(renavam) {
        const custoSnapshot = await db.collection('Custos').get();
        let custoEncontrado = null;

        custoSnapshot.forEach((doc) => {
            if (doc.data().RENAVAM_Custo === renavam) {
                custoEncontrado = doc.data();
            }
        });

        if (custoEncontrado) {
            document.getElementById('data').value = custoEncontrado.Data;
            document.getElementById('descricaoCustos').value = custoEncontrado.Descricao_Custos;
            document.getElementById('quemPagou').value = custoEncontrado.Quem_Pagou;
            document.getElementById('metodoPagamento').value = custoEncontrado.Metodo_Pagamento;
            document.getElementById('valorCustos').value = custoEncontrado.Valor_Custos;
        } else {
            document.getElementById('costForm').reset();
        }
    }

    // Ouvinte de evento para quando o usuário mudar o valor do RENAVAM no formulário de custo
    document.getElementById('renavamCusto').addEventListener('change', function() {
        const renavam = document.getElementById('renavamCusto').value;
        buscarCustoPorRenavam(renavam);
    });
});
