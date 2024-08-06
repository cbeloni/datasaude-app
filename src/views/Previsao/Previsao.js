import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem";

import { InsertChart, Update } from "@material-ui/icons";
import { Box, Input, Button, Typography, InputLabel } from "@mui/material";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import { format } from "date-fns";
import moment from "moment";
import isValidDate from "utils/validators";
import CustomLineGraph from "components/Graph/CustomLineGraph";
import axios from "axios";
import LoadingModal from "components/Progress/LoadingModal";
import CidSelect from "./CidSelect";

const useStyles = makeStyles(styles);

const base_url_api_ml = "https://datasaude-api-ml.beloni.dev.br";

export default function Dashboard() {
  const [dateRange] = React.useState([
    moment("01/01/2022", "DD/MM/YYYY").toDate(),
    moment("28/02/2022", "DD/MM/YYYY").toDate(),
  ]);
  const classes = useStyles();

  const [cid, setCid] = React.useState("TODOS");
  const [tipo, setTipo] = React.useState("ATENDIMENTO");
  const [previsaoPath, setPrevisaoPath] = React.useState("5");
  const [sazonalidade, setSazonalidade] = React.useState("180");
  const [xLabels, setXLabels] = React.useState([]);
  const [previsao, setPrevisao] = React.useState([]);
  const [historico, setHistorico] = React.useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getDateRangeText = (dataRange) => {
    if (dataRange && isValidDate(dataRange)) {
      return `Dados não selacionados`;
    }

    let [dataInicial, dataFinal] = dataRange;
    let dataInicialFormatada = format(dataInicial, "dd/MM/yyyy");
    let dataFinalFormatada = format(dataFinal, "dd/MM/yyyy");
    console.log(`Dados de ${dataInicialFormatada} até  ${dataFinalFormatada}`);
    return `Dados de ${dataInicialFormatada} até  ${dataFinalFormatada}`;
  };

  const treinarModelo = async () => {
    try {
      const response = await axios.post(
        `${base_url_api_ml}/api/temporal/treinar`,
        {}, //body
        {
          params: {
            qtd_dias_previsao: previsaoPath,
            qtd_dias_sazonalidade: sazonalidade,
            cid: cid,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
      throw error;
    }
  };

  const getPrevisoes = async () => {
    try {
      const response = await axios.get(
        `${base_url_api_ml}/api/temporal/previsao`,
        {
          params: {
            cid: cid,
          },
        }
      );

      const datas = response.data
        .map((item) => item.data)
        .map((dateStr) => new Date(dateStr));
      const valoresHistoricos = response.data.map(
        (item) => item.valor_historico
      );
      const valoresPrevisao = response.data.map((item) => item.valor_previsao);

      setXLabels(datas);
      setHistorico(valoresHistoricos);
      setPrevisao(valoresPrevisao);

      console.log("Finalizado get previsoes");

      return response.data;
    } catch (error) {
      console.error("Erro ao fazer a requisição get api:", error);
      throw error;
    }
  };

  const getCardColor = (qualidade) => {
    const colorMap = {
      "N1 - BOA": "success",
      "N2 - MODERADA": "warning",
      "N3 - RUIM": "danger",
      "N4 - MUITO RUIM": "rose",
    };

    return colorMap[qualidade] || "warning"; // Retorna a cor mapeada ou "rose" se não houver correspondência
  };

  const handleSazonalidadeChange = (event) => {
    console.log(event.target.value);
    setSazonalidade(event.target.value);
  };

  const handlePrevisaoChange = (event) => {
    console.log(event.target.value);
    setPrevisaoPath(event.target.value);
  };

  const handleCidChange = (event) => {
    console.log(event.target.value);
    setCid(event.target.value);
  };

  const handleTipoChange = (event) => {
    console.log(event.target.value);
    setTipo(event.target.value);
  };

  const handleTreinarClick = async () => {
    try {
      setModalIsOpen(true);
      await treinarModelo();
      await getPrevisoes();
      console.log("finalizado");
    } catch (error) {
      alert(`Erro: ${error.message}`);
    } finally {
      setModalIsOpen(false);
    }
  };

  useEffect(() => {
    getPrevisoes();
  }, []);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color={getCardColor("N1 - BOA")} stats icon>
              <CardIcon color={getCardColor("N1 - BOA")}>
                <InsertChart></InsertChart>
              </CardIcon>
              <p className={classes.cardCategory}>
                Pacientes atendidos x previsto
              </p>
            </CardHeader>
            <CardBody>
              <div className={classes.CardBody}>
                <Box
                  className="estiloHorizontal"
                  justifyContent="space-between"
                >
                  <div
                    style={{
                      paddingLeft: "100px",
                      paddingRight: "20px",
                      paddingTop: "10px",
                    }}
                  >
                    <InputLabel id="previsao-label">Dias previsão:</InputLabel>
                    <Input
                      labelId="previsao-label"
                      type="number"
                      id="previsao"
                      name="previsao"
                      value={previsaoPath}
                      onChange={handlePrevisaoChange}
                    ></Input>
                  </div>
                  <div
                    style={{
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      paddingTop: "10px",
                    }}
                  >
                    <TipoSelect
                      tipo={tipo}
                      handleTipoChange={handleTipoChange}
                    ></TipoSelect>
                  </div>
                  <div
                    style={{
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      paddingTop: "10px",
                    }}
                  >
                    <InputLabel id="sazonalidade-label">
                      Dias sazonalidade:
                    </InputLabel>
                    <Input
                      labelId="cid-label"
                      type="number"
                      id="sazonalidade"
                      name="sazonalidade"
                      value={sazonalidade}
                      onChange={handleSazonalidadeChange}
                    ></Input>
                  </div>
                  <div
                    style={{
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      paddingTop: "10px",
                    }}
                  >
                    <CidSelect
                      cid={cid}
                      handleCidChange={handleCidChange}
                    ></CidSelect>
                  </div>
                  <div
                    style={{
                      paddingLeft: "20px",
                      paddingRight: "300px",
                      paddingTop: "20px",
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={handleTreinarClick}
                      variant="contained"
                      size="large"
                      disableElevation
                    >
                      Calcular
                    </Button>
                  </div>
                </Box>
                <CustomLineGraph
                  xLabels={xLabels}
                  previsao={previsao}
                  historico={historico}
                ></CustomLineGraph>
              </div>
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                <Typography>{getDateRangeText(dateRange)}</Typography>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <LoadingModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
    </div>
  );
}
