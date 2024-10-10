document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Firebase e inicialização (seu código existente permanece)
    const firebaseConfig = {
        apiKey: "AIzaSyCWT72-XVlMkIBU64KhAbeZhaykRfln5As",
        authDomain: "vendascarro-estudo.firebaseapp.com",
        projectId: "vendascarro-estudo",
        storageBucket: "vendascarro-estudo.appspot.com",
        messagingSenderId: "1065254193744",
        appId: "1:1065254193744:web:0154a1cb974c9658c19f55",
        measurementId: "G-ME5MH151S1"
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Persistência de login e verificação de autenticação (seu código existente permanece)
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(error => {
        console.error("Erro ao definir a persistência de autenticação:", error);
    });

    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('forms').style.display = 'block';
            document.getElementById('logoutButton').style.display = 'block';
            preencherDatalists(); // Função para preencher as sugestões
        } else {
            document.getElementById('forms').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'none';
        }
    });

    // Função para preencher datalists (seu código existente permanece)
    function preencherDatalists() {
        preencherDatalist('renavamsCar', 'Caracteristicas', 'RENAVAM');
        // Outros datalists preenchidos...
    }

    // Função para preencher datalist (seu código existente permanece)
    function preencherDatalist(datalistId, collection, field) {
        const datalistElement = document.getElementById(datalistId);
        db.collection(collection).get().then(querySnapshot => {
            const uniqueValues = new Set();
            querySnapshot.forEach(doc => uniqueValues.add(doc.data()[field]));
            Array.from(uniqueValues).sort().forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                datalistElement.appendChild(option);
            });
        }).catch(error => {
            console.error(`Erro ao buscar dados da coleção ${collection}:`, error);
        });
    }

    // --- NOVO CÓDIGO: Detecta a mudança no campo RENAVAM e preenche os campos automaticamente ---
    const renavamInput = document.getElementById('renavam');
    renavamInput.addEventListener('change', function() {
        const renavam = renavamInput.value;
        if (renavam) {
            // Buscar os dados do carro no Firestore com base no RENAVAM
            db.collection('Caracteristicas').where('RENAVAM', '==', renavam).get()
                .then(querySnapshot => {
                    if (!querySnapshot.empty) {
                        const doc = querySnapshot.docs[0]; // Pega o primeiro documento encontrado
                        const data = doc.data();

                        // Preenche os campos do formulário com os dados do carro
                        document.getElementById('marca').value = data.Marca || '';
                        document.getElementById('modelo').value = data.Modelo || '';
                        document.getElementById('anoFab').value = data.Ano_Fab || '';
                        document.getElementById('anoModelo').value = data.Ano_Modelo || '';
                        document.getElementById('versao').value = data.Versao || '';
                        document.getElementById('litragemMotor').value = data.Litragem_Motor || '';
                        document.getElementById('cor').value = data.Cor || '';
                        document.getElementById('placaAntiga').value = data.Placa_Antiga || '';
                        document.getElementById('placaMercosul').value = data.Placa_Mercosul || '';
                        document.getElementById('codigoFIPE').value = data.Codigo_FIPE || '';

                        console.log('Campos preenchidos com sucesso com base no RENAVAM.');
                    } else {
                        alert('RENAVAM não encontrado. Preencha os campos manualmente.');
                        carForm.reset(); // Limpa o formulário se o RENAVAM não for encontrado
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar dados do carro pelo RENAVAM:', error);
                });
        }
    });

    // Função de login (seu código existente permanece)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    alert('Login realizado com sucesso!');
                })
                .catch(error => {
                    alert('Erro ao fazer login: ' + error.message);
                });
        });
    }

    // Função para adicionar carro (seu código existente permanece)
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
                carForm.reset();
            })
            .catch(error => {
                alert('Erro ao adicionar carro: ' + error.message);
            });
        });
    }
});
