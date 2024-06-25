// apiService.js
const API_BASE_URL = "http://177.93.130.51/api";

const obtemPacientes = async (requestData) => {
  const apiUrl = `${API_BASE_URL}/v1/paciente`;

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
