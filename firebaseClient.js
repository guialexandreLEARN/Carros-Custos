import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

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
        // Continua com as operações normais de login...
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
