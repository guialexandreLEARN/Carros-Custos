firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("Usuário autenticado:", user.email);
  } else {
    console.log("Nenhum usuário autenticado. Por favor, faça login.");
  }
});



async function addCar() {
  const car = {
	RENAVAM: "987654321", // Chave primária
    Ano_Fab: "2020",
    Ano_Modelo: "2021",
    Cor: "Preto",
    Código_FIPE: "123456",
    Litragem_Motor: "2.0",
    Marca: "Toyota",
    Modelo: "Corolla",
    Placa_Antiga: "ABC1234",
    Placa_Mercosul: "BRA2A12",
    Versão: "XEI"
  };

  await db.collection('Caracteristicas').doc(car.RENAVAM).set(car);
}

addCar();


// Inserindo um custo
async function addCost() {
  const cost = {
    Data: "08/10/2024",
    Descricao_Custos: "Troca de óleo",
    Metodo_Pagamento: "Cartão de Crédito",
    RENAVAM: "987654321", // Relaciona com o RENAVAM da tabela Caracteristicas
    Valor_Custos: "300,00"
  };

  await db.collection('Custos').add(cost);
}

addCost();
