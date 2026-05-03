import React, { useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import axios from "axios";
import { format } from "date-fns";
import { Box, Button, Stack } from "@mui/material";
import PropTypes from "prop-types";
import RadioGroupCid from "components/RadioGroup/RadioGroupCid";
import { chartPalette, chartSx } from "theme/chartPalette";

const valueFormatter = (value) => `${value} ocorrências`;

const chartSetting = {
  yAxis: [
    {
      label: "Qtd CID",
    },
  ],
  series: [{ dataKey: "qtd", label: "Qtd CID", valueFormatter }],
  height: 300,
  colors: chartPalette,
  sx: {
    ...chartSx,
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function CustomCidGraphBars(props) {
  const [dados, setDados] = React.useState([{ qtd: 0, DT_ATENDIMENTO: "" }]);
  const [chave] = React.useState("cid");
  const [query, setQuery] = React.useState("cid_maiores");
  const URL_BASE = `${process.env.REACT_APP_API_URL}/api/v1/paciente/queries/`;
  const [url, setUrl] = React.useState(URL_BASE);

  const handleChangeQuery = (event) => {
    setQuery(event.target.value);
  };

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

    if (query === "cid") {
      filtros += `?query=cid`;
    }
    if (query === "cid_maiores") {
      filtros += `?query=cid_maiores`;
    }

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
    <Box sx={{ width: "100%" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <RadioGroupCid value={query} onChange={handleChangeQuery} />
        <Button size="small" variant="outlined" onClick={handleButtonClick}>
          Atualizar
        </Button>
      </Stack>
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
    </Box>
  );
}

CustomCidGraphBars.propTypes = {
  dateRange: PropTypes.any,
};
