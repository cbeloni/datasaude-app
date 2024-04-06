import React, { useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import axios from "axios";
import { format } from "date-fns";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";

const valueFormatter = (value) => `${value} ocorrências`;

const chartSetting = {
  yAxis: [
    {
      label: "Qtd CID",
    },
  ],
  series: [{ dataKey: "qtd", label: "Qtd CID", valueFormatter }],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function CustomCidGraphBars(props) {
  const [dados, setDados] = React.useState([{ qtd: 0, DT_ATENDIMENTO: "" }]);
  const [chave] = React.useState("cid");
  const URL_BASE =
    "http://datasaude-api.beloni.dev.br/api/v1/paciente/queries/";
  const [url, setUrl] = React.useState(URL_BASE);

  const handleButtonClick = () => {
    console.log("props:", props);
    const [dataInicial, dataFinal] = props.dateRange || [null, null];
    let filtros = "";
    if (dataInicial && dataFinal) {
      let dataInicialFormatada = format(dataInicial, "ddMMyyyy");
      let dataFinalFormatada = format(dataFinal, "ddMMyyyy");
      console.log("dataInicial", dataInicialFormatada);
      console.log("dataFinal", dataFinalFormatada);
      filtros += `${dataInicialFormatada}/${dataFinalFormatada}`;
    }

    filtros += `?query=cid`;

    let urlChanged = `${URL_BASE}${filtros}`;
    console.log("Resultado url alterada ", urlChanged);
    setUrl(urlChanged);
  };

  useEffect(() => {
    console.log("DataRange foi alterado");
    let [dataInicial, dataFinal] = props.dateRange || [null, null];

    if (dataInicial && dataFinal) {
      console.log(dataInicial);
      console.log(dataFinal);
      handleButtonClick();
    }
  }, [props.dateRange]);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setDados(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [url]);

  useEffect(() => {
    handleButtonClick();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <Box className="estiloHorizontal" justifyContent="space-between">
        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "40px",
            paddingTop: "10px",
          }}
        ></div>
      </Box>
      <BarChart
        dataset={dados}
        xAxis={[
          {
            scaleType: "band",
            dataKey: chave,
            tickPlacement: "middle",
            tickLabelPlacement: "middle",
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
}

CustomCidGraphBars.propTypes = {
  dateRange: PropTypes.any,
};
