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

// Preencher as listas de sugestões no formulário de "Adicionar Carro"
preencherDatalist('renavamsCar', 'Caracteristicas', 'RENAVAM');  // Preencher RENAVAM
preencherDatalist('marcas', 'Caracteristicas', 'Marca'); // Preencher Marca
preencherDatalist('modelos', 'Caracteristicas', 'Modelo'); // Preencher Modelo
preencherDatalist('anosFabricacao', 'Caracteristicas', 'Ano_Fab'); // Preencher Ano de Fabricação
preencherDatalist('anosModelo', 'Caracteristicas', 'Ano_Modelo'); // Preencher Ano do Modelo
preencherDatalist('versoes', 'Caracteristicas', 'Versao'); // Preencher Versão
preencherDatalist('litragensMotor', 'Caracteristicas', 'Litragem_Motor'); // Preencher Litragem do Motor
preencherDatalist('cores', 'Caracteristicas', 'Cor'); // Preencher Cor
preencherDatalist('placasAntigas', 'Caracteristicas', 'Placa_Antiga'); // Preencher Placa Antiga
preencherDatalist('placasMercosul', 'Caracteristicas', 'Placa_Mercosul'); // Preencher Placa Mercosul
preencherDatalist('codigosFIPE', 'Caracteristicas', 'Codigo_FIPE'); // Preencher Código FIPE

// Função para buscar os dados do Firestore e preencher o formulário de carro
async function buscarCarroPorRenavam(renavam) {
    const docRef = collection(db, 'Caracteristicas');
    const carroSnapshot = await getDocs(docRef);  // Renomeei a variável para 'carroSnapshot'
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
        // Limpar o formulário para permitir o preenchimento manual
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
    const docRef = collection(db, 'Custos');
    const custoSnapshot = await getDocs(docRef);  // Renomeei a variável para 'custoSnapshot'
    let custoEncontrado = null;

    custoSnapshot.forEach((doc) => {
        if (doc.data().RENAVAM_Custo === renavam) {
            custoEncontrado = doc.data();
        }
    });

    if (custoEncontrado) {
        // Preencher o formulário com os dados existentes
        document.getElementById('data').value = custoEncontrado.Data;
        document.getElementById('descricaoCustos').value = custoEncontrado.Descricao_Custos;
        document.getElementById('quemPagou').value = custoEncontrado.Quem_Pagou;
        document.getElementById('metodoPagamento').value = custoEncontrado.Metodo_Pagamento;
        document.getElementById('valorCustos').value = custoEncontrado.Valor_Custos;
    } else {
        // Limpar o formulário para permitir o preenchimento manual
        document.getElementById('costForm').reset();
    }
}

// Ouvinte de evento para quando o usuário mudar o valor do RENAVAM no formulário de custo
document.getElementById('renavamCusto').addEventListener('change', function() {
    const renavam = document.getElementById('renavamCusto').value;
    buscarCustoPorRenavam(renavam);
});
