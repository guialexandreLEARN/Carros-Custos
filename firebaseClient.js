document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Firebase e inicialização
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

    // --- NOVO CÓDIGO: Detecta a mudança no campo RENAVAM com tratamento de erros sofisticado ---
    const renavamInput = document.getElementById('renavam');
    renavamInput.addEventListener('change', function() {
        const renavam = renavamInput.value;

        // Verificar se o campo RENAVAM não está vazio
        if (!renavam) {
            alert('Por favor, insira um RENAVAM.');
            return;
        }

        // Verificar se o RENAVAM tem um formato esperado (um RENAVAM tem 11 dígitos)
        const renavamRegex = /^\d{11}$/;
        if (!renavamRegex.test(renavam)) {
            alert('RENAVAM inválido. O RENAVAM deve conter exatamente 11 dígitos.');
            return;
        }

        // Inicia a busca no Firestore
        db.collection('Caracteristicas').where('RENAVAM', '==', renavam).get()
            .then(querySnapshot => {
                // Verificar se o RENAVAM foi encontrado no Firestore
                if (querySnapshot.empty) {
                    alert('RENAVAM não encontrado. Por favor, insira manualmente as informações do carro.');
                    return;
                }

                // Preenche os campos do formulário com os dados encontrados
                const doc = querySnapshot.docs[0];
                const data = doc.data();

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
            })
            .catch(error => {
                // Tratar erros de conexão com o Firestore
                if (error.code === 'unavailable') {
                    alert('Erro de conexão com o Firestore. Verifique sua conexão com a internet e tente novamente.');
                } else if (error.code === 'permission-denied') {
                    alert('Permissão negada para acessar os dados. Verifique suas permissões no Firebase.');
                } else {
                    // Tratar outros erros genéricos
                    alert('Erro ao buscar dados do carro pelo RENAVAM. Por favor, tente novamente mais tarde.');
                }
                console.error('Erro ao buscar dados do carro:', error);
            });
    });

    // Outros códigos continuam aqui, incluindo login, adição de carros, etc.
});
