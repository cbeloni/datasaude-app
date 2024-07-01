// apiService.js
const obtemPacientes = async (requestData) => {
  const apiUrl = `https://datasaude-api.beloni.dev.br/api/v1/paciente/`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter os dados: ${JSON.stringify(requestData)}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Erro na requisição: ${error.message}`);
  }
};

export default obtemPacientes;
