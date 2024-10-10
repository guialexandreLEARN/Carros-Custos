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

    // Definir a persistência de login para 'local'
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
            document.getElementById('forms').style.display = 'block';
            document.getElementById('logoutButton').style.display = 'block';

            // Chamar função para preencher as listas de sugestões após o login
            preencherDatalists();
        } else {
            console.log('Nenhum usuário logado');
            document.getElementById('forms').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'none';
        }
    });

    // Função para preencher todos os datalists
    function preencherDatalists() {
        console.log('Preenchendo datalists...');
        // Preencher os datalists do formulário de adicionar carro
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

        // Preencher os datalists do formulário de adicionar custo
        preencherDatalist('renavamsCost', 'Custos', 'RENAVAM_Custo');
        preencherDatalist('descriptions', 'Custos', 'Descricao_Custos');
        preencherDatalist('quemPagouList', 'Custos', 'Quem_Pagou');
        preencherDatalist('paymentMethods', 'Custos', 'Metodo_Pagamento');
    }

    // Função para preencher os datalists com dados do Firestore
    function preencherDatalist(datalistId, collection, field) {
        const datalistElement = document.getElementById(datalistId);
        if (!datalistElement) {
            console.error(`Elemento ${datalistId} não encontrado.`);
            return;
        }

        console.log(`Preenchendo datalist ${datalistId} da coleção ${collection} no campo ${field}`);

        // Busca os dados no Firestore
        db.collection(collection).get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log(`Nenhum dado encontrado na coleção ${collection}.`);
                    return;
                }

                const uniqueValues = new Set();  // Para evitar valores duplicados
                querySnapshot.forEach((doc) => {
                    const fieldValue = doc.data()[field];
                    if (fieldValue) {
                        uniqueValues.add(fieldValue);
                    }
                });

                // Ordena os valores e adiciona ao datalist
                const sortedValues = Array.from(uniqueValues).sort();
                sortedValues.forEach((value) => {
                    const option = document.createElement('option');
                    option.value = value;
                    datalistElement.appendChild(option);
                });

                console.log(`Datalist ${datalistId} preenchido com sucesso.`);
            })
            .catch((error) => {
                console.error(`Erro ao buscar dados da coleção ${collection}:`, error);
            });
    }

    // Função de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
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

    // Função para adicionar carro ao Firestore
    const carForm = document.getElementById('carForm');
    if (carForm) {
        carForm.addEventListener('submit', function(event) {
            event.preventDefault();
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

    // Função para adicionar custo ao Firestore
    const costForm = document.getElementById('costForm');
    if (costForm) {
        costForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const renavamCusto = document.getElementById('renavamCusto').value;
            const descricaoCustos = document.getElementById('descricaoCustos').value;
            const quemPagou = document.getElementById('quemPagou').value;
            const metodoPagamento = document.getElementById('metodoPagamento').value;
            const valorCustos = document.getElementById('valorCustos').value;

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
