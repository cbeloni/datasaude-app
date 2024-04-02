import React, { useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import axios from "axios";
import DatePicker from "components/DataPicker/ReactDatePicker";
import { format } from "date-fns";
import RadioGroupMesAno from "components/RadioGroup/RadioGroupMesAno";
import { Box, Button } from "@material-ui/core";

const valueFormatter = (value) => `${value} pacientes`;

const chartSetting = {
  yAxis: [
    {
      label: "Qtd atendimentos",
    },
  ],
  series: [{ dataKey: "qtd", label: "Qtd atendimentos", valueFormatter }],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function CustomGraphBars() {
  const [dateRange, setDateRange] = React.useState([null, null]);
  const [dados, setDados] = React.useState([{ qtd: 0, DT_ATENDIMENTO: "" }]);
  const [selectedPeriod, setSelectedPeriod] = React.useState("dia");
  const [chave, setChave] = React.useState("DT_ATENDIMENTO");
  const URL_BASE =
    "http://datasaude-api.beloni.dev.br/api/v1/paciente/agrupado/";
  const [url, setUrl] = React.useState(URL_BASE);

  const handleChangePeriodo = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const handleButtonClick = () => {
    const [dataInicial, dataFinal] = dateRange;
    let filtros = "";
    if (dataInicial && dataFinal) {
      let dataInicialFormatada = format(dataInicial, "ddMMyyyy");
      let dataFinalFormatada = format(dataFinal, "ddMMyyyy");
      console.log("dataInicial", dataInicialFormatada);
      console.log("dataFinal", dataFinalFormatada);
      filtros += `${dataInicialFormatada}/${dataFinalFormatada}`;
    }

    if (selectedPeriod === "dia") {
      filtros += `?agrupar=dia`;
      setChave("DT_ATENDIMENTO");
    }
    if (selectedPeriod === "mes") {
      filtros += `?agrupar=mes`;
      setChave("mes");
      console.log(chave);
    }

    let urlChanged = `${URL_BASE}${filtros}`;
    console.log("Resultado url alterada ", urlChanged);
    setUrl(urlChanged);
  };

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        console.log("response: ", response.data);
        setDados(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [url]);

  useEffect(() => {
    handleButtonClick();
  }, []);

  const atualizaData = (data) => {
    setDateRange(data);
    console.log(data);
  };

  return (
    <div style={{ width: "100%" }}>
      <Box className="estiloHorizontal" justifyContent="space-between">
        <DatePicker value={dateRange} onChange={atualizaData}></DatePicker>
        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "40px",
            paddingTop: "10px",
          }}
        >
          <RadioGroupMesAno
            value={selectedPeriod}
            onChange={handleChangePeriodo}
          ></RadioGroupMesAno>
        </div>
        <Button color="primary" onClick={handleButtonClick}>
          Filtrar
        </Button>
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
