const formatarPacienteMapa = (objeto) => {
  // const dados = Object.values(objeto).join("|");
  return {
    objeto,
    localidade: [objeto.latitude, objeto.longitude].map(parseFloat),
  };
};

export default formatarPacienteMapa;
