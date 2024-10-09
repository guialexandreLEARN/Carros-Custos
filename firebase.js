// firebase.js
const admin = require('firebase-admin');
require('dotenv').config(); // Carrega as variáveis de ambiente
const serviceAccount = require('./vendascarro-estudo-firebase-adminsdk-qpzbm-a8bb66e7e2.json');

// Inicializando o Firebase Admin SDK
console.log("Inicializando Firebase Admin...");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
console.log("Firebase Admin inicializado com sucesso.");

// Exemplo de adicionar dados no Firestore pelo backend
async function adicionarCarroBackend(carData) {
    try {
        console.log("Tentando adicionar carro no backend com os seguintes dados:", carData);
        await db.collection('Caracteristicas').doc(carData.RENAVAM).set(carData);
        console.log("Carro adicionado no backend com sucesso!");
    } catch (error) {
        console.error("Erro ao adicionar carro no backend:", error);
    }
}

// Exemplo de como chamar a função de backend
// adicionarCarroBackend({
//     Ano_Fab: 2020,
//     Ano_Modelo: 2021,
//     Cor: "Preto",
//     Código_FIPE: "123456",
//     RENAVAM: "654321",
// });
