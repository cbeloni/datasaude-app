const poluentesColumns = [
  { field: "id", headerName: "Id", width: 80 },
  { field: "nome", headerName: "Estação", width: 200, flex: 1 },
  { field: "situacao_rede", headerName: "Situação rede", width: 140 },
  { field: "qualidade", headerName: "Qualidade", width: 160 },
  { field: "indice", headerName: "Índice", width: 100 },
  { field: "poluente", headerName: "Poluente", width: 110 },
  { field: "endereco", headerName: "Endereço", width: 260 },
  { field: "data", headerName: "Data coleta", width: 160 },
  { field: "data_atual", headerName: "Data sistema", width: 160 },
];

const PoluentesHelper = () => ({ poluentesColumns });

export default PoluentesHelper;
