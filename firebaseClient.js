document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Firebase (frontend)
    // Configuração do Firebase e inicialização (seu código existente permanece)
    const firebaseConfig = {
        apiKey: "AIzaSyCWT72-XVlMkIBU64KhAbeZhaykRfln5As",
        authDomain: "vendascarro-estudo.firebaseapp.com",
@@ -11,101 +10,86 @@ document.addEventListener('DOMContentLoaded', function() {
        measurementId: "G-ME5MH151S1"
    };

    // Inicializando o Firebase
    // Inicializar Firebase
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
    // Persistência de login e verificação de autenticação (seu código existente permanece)
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(error => {
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
            preencherDatalists(); // Função para preencher as sugestões
        } else {
            console.log('Nenhum usuário logado');
            document.getElementById('forms').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'none';
        }
    });

    // Função para preencher todos os datalists
    // Função para preencher datalists (seu código existente permanece)
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
        // Outros datalists preenchidos...
    }

    // Função para preencher os datalists com dados do Firestore
    // Função para preencher datalist (seu código existente permanece)
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

                const uniqueValues = new Set();  // Para evitar valores duplicados
                querySnapshot.forEach((doc) => {
                    const fieldValue = doc.data()[field];
                    if (fieldValue) {
                        uniqueValues.add(fieldValue);
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
    // Função de login (seu código existente permanece)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
@@ -114,19 +98,16 @@ document.addEventListener('DOMContentLoaded', function() {
            const password = document.getElementById('password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    console.log('Usuário logado: ', userCredential.user.email);
                .then(userCredential => {
                    alert('Login realizado com sucesso!');
                })
                .catch((error) => {
                .catch(error => {
                    alert('Erro ao fazer login: ' + error.message);
                });
        });
    } else {
        console.error("Elemento 'loginForm' não encontrado.");
    }

    // Função para adicionar carro ao Firestore
    // Função para adicionar carro (seu código existente permanece)
    const carForm = document.getElementById('carForm');
    if (carForm) {
        carForm.addEventListener('submit', function(event) {
@@ -158,43 +139,11 @@ document.addEventListener('DOMContentLoaded', function() {
            })
            .then(() => {
                alert('Carro adicionado com sucesso!');
                carForm.reset(); // Limpa o formulário após o envio
                carForm.reset();
            })
            .catch((error) => {
            .catch(error => {
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
