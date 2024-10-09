<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carros e Custos</title>
    <style>
        /* Estilos... */
    </style>
</head>
<body>
    <h1>Gerenciar Carros e Custos</h1>

    <!-- Login Form -->
    <h2>Login</h2>
    <form id="loginForm">
        <label>Email: <input type="email" id="email" required></label><br>
        <label>Senha: <input type="password" id="password" required></label><br>
        <button type="submit">Entrar</button>
    </form>

    <!-- Formulário para Adicionar Carro -->
    <form id="carForm">
        <h3>Adicionar Carro</h3>
        <label>Ano de Fabricação: <input type="text" id="anoFab"></label><br>
        <label>Ano do Modelo: <input type="text" id="anoModelo"></label><br>
        <label>Cor: <input type="text" id="cor"></label><br>
        <label>Código FIPE: <input type="text" id="codigoFIPE"></label><br>
        <label>Litragem do Motor: <input type="text" id="litragemMotor"></label><br>
        <label>Marca: <input type="text" id="marca"></label><br>
        <label>Modelo: <input type="text" id="modelo"></label><br>
        <label>Placa Antiga: <input type="text" id="placaAntiga"></label><br>
        <label>Placa Mercosul: <input type="text" id="placaMercosul"></label><br>
        <label>RENAVAM (Chave Primária): <input type="text" id="renavam"></label><br>
        <label>Versão: <input type="text" id="versao"></label><br>
        <button type="submit">Adicionar Carro</button>
    </form>

    <!-- Formulário para Adicionar Custo -->
    <form id="costForm">
        <h3>Adicionar Custo</h3>
        <label>Data: <input type="date" id="data"></label><br>
        <label>Descrição dos Custos: <input type="text" id="descricaoCustos"></label><br>
        <label>Método de Pagamento: <input type="text" id="metodoPagamento"></label><br>
        <label>RENAVAM (Relaciona com o carro): <input type="text" id="renavamCusto"></label><br>
        <label>Valor dos Custos: <input type="number" id="valorCustos"></label><br>
        <button type="submit">Adicionar Custo</button>
    </form>

    <!-- Firebase SDK -->
    <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
        import { getFirestore, collection, doc, setDoc, addDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
        import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

        // Configurar Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyCWT72-XVlMkIBU64KhAbeZhaykRfln5As",
            authDomain: "vendascarro-estudo.firebaseapp.com",
            projectId: "vendascarro-estudo",
            storageBucket: "vendascarro-estudo.appspot.com",
            messagingSenderId: "1065254193744",
            appId: "1:1065254193744:web:0154a1cb974c9658c19f55",
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);

        // Login
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    alert('Login realizado com sucesso!');
                })
                .catch((error) => {
                    alert('Erro ao fazer login: ' + error.message);
                });
        });

        // Adicionar Carro
        document.getElementById('carForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const carData = {
                Ano_Fab: document.getElementById('anoFab').value,
                Ano_Modelo: document.getElementById('anoModelo').value,
                Cor: document.getElementById('cor').value,
                Código_FIPE: document.getElementById('codigoFIPE').value,
                Litragem_Motor: document.getElementById('litragemMotor').value,
                Marca: document.getElementById('marca').value,
                Modelo: document.getElementById('modelo').value,
                Placa_Antiga: document.getElementById('placaAntiga').value,
                Placa_Mercosul: document.getElementById('placaMercosul').value,
                RENAVAM: document.getElementById('renavam').value,
                Versão: document.getElementById('versao').value,
            };

            setDoc(doc(db, 'Caracteristicas', carData.RENAVAM), carData)
                .then(() => {
                    alert('Carro adicionado com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao adicionar carro:', error);
                });
        });

        // Adicionar Custo
        document.getElementById('costForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const costData = {
                Data: document.getElementById('data').value,
                Descricao_Custos: document.getElementById('descricaoCustos').value,
                Metodo_Pagamento: document.getElementById('metodoPagamento').value,
                RENAVAM: document.getElementById('renavamCusto').value,
                Valor_Custos: document.getElementById('valorCustos').value,
            };

            addDoc(collection(db, 'Custos'), costData)
                .then(() => {
                    alert('Custo adicionado com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao adicionar custo:', error);
                });
        });

        // Verificar estado de autenticação
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('Usuário autenticado:', user.email);
            } else {
                console.log('Nenhum usuário autenticado');
            }
        });
    </script>
</body>
</html>
