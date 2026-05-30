const API_BASE = `${process.env.REACT_APP_API_URL}/api/v1/ibge`;

const postIbgeList = async (payload) => {
  const doRequest = async (body) =>
    fetch(`${API_BASE}/listar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

  let response = await doRequest(payload);

  if (!response.ok) {
    response = await doRequest({ payload });
  }

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  return response.json();
};

const listIbgeFormulas = async () => {
  const response = await fetch(`${API_BASE}/formulas-customizadas`);

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  return response.json();
};

const createIbgeFormula = async (payload) => {
  const response = await fetch(`${API_BASE}/formulas-customizadas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  return response.json();
};

const deleteIbgeFormula = async (formulaId) => {
  const response = await fetch(
    `${API_BASE}/formulas-customizadas/${formulaId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  return response.json();
};

export { postIbgeList, listIbgeFormulas, createIbgeFormula, deleteIbgeFormula };
