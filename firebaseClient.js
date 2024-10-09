import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Definir a persistência de login para 'local' (persistência no navegador)
auth.setPersistence(browserLocalPersistence)
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

    signInWithEmailAndPassword(auth, email, password)
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
    signOut(auth).then(() => {
        alert('Logout realizado com sucesso!');
        document.getElementById('forms').style.display = 'none'; // Esconde os formulários após o logout
        document.getElementById('logoutButton').style.display = 'none'; // Esconde o botão de sair
    }).catch((error) => {
        alert('Erro ao fazer logout: ' + error.message);
    });
});

// Verificação de autenticação
onAuthStateChanged(auth, (user) => {
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
    const querySnapshot = await getDocs(collection(db, collectionName));
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

// Preencher as listas de sugestões no formulário
preencherDatalist('renavams', 'Caracteristicas', 'RENAVAM');  // Preencher RENAVAM
preencherDatalist('descriptions', 'Custos', 'Descricao_Custos'); // Preencher Descrição dos Custos
preencherDatalist('quemPagouList', 'Custos', 'Quem_Pagou'); // Preencher Quem pagou
preencherDatalist('paymentMethods', 'Custos', 'Metodo_Pagamento'); // Preencher Método de Pagamento

// Função para adicionar carro ao Firestore
document.getElementById('carForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir comportamento padrão do formulário

    // Capturando os dados do formulário de "Adicionar Carro"
    const carData = {
        RENAVAM: document.getElementById('renavam').value,
        Marca: document.getElementById('marca').value,
        Modelo: document.getElementById('modelo').value,
        Ano_Fab: document.getElementById('anoFab').value,
        Ano_Modelo: document.getElementById('anoModelo').value,
        Versao: document.getElementById('versao').value,
        Litragem_Motor: document.getElementById('litragemMotor').value,
        Cor: document.getElementById('cor').value,
        Placa_Antiga: document.getElementById('placaAntiga').value,
        Placa_Mercosul: document.getElementById('placaMercosul').value,
        Codigo_FIPE: document.getElementById('codigoFIPE').value
    };

    console.log("Adicionando carro:", carData); // Log para depuração

    // Adicionando os dados do carro no Firestore
    addDoc(collection(db, 'Caracteristicas'), carData)
        .then(() => {
            alert('Carro cadastrado com sucesso!');
        })
        .catch((error) => {
            console.error('Erro ao cadastrar o carro:', error);
            alert('Erro ao cadastrar o carro: ' + error.message);
        });
});

// Função para adicionar custo ao Firestore
document.getElementById('costForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir comportamento padrão do formulário

    // Capturando os dados do formulário de "Adicionar Custo"
    const costData = {
        RENAVAM_Custo: document.getElementById('renavamCusto').value,
        Data: document.getElementById('data').value,
        Descricao_Custos: document.getElementById('descricaoCustos').value,
        Quem_Pagou: document.getElementById('quemPagou').value,
        Metodo_Pagamento: document.getElementById('metodoPagamento').value,
        Valor_Custos: document.getElementById('valorCustos').value
    };

    console.log("Adicionando custo:", costData); // Log para depuração

    // Adicionando os dados do custo no Firestore
    addDoc(collection(db, 'Custos'), costData)
        .then(() => {
            alert('Custo cadastrado com sucesso!');
        })
        .catch((error) => {
            console.error('Erro ao cadastrar o custo:', error);
            alert('Erro ao cadastrar o custo: ' + error.message);
        });
});
