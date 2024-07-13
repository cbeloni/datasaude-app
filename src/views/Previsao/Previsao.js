import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem";

import { InsertChart, Update } from "@material-ui/icons";
import { Box, Input, Button, Typography } from "@mui/material";
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
import {
  xLabels,
  previsao,
  historico,
} from "components/Graph/CustomLineGraphValues";
import axios from "axios";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const [dateRange] = React.useState([
    moment("01/01/2022", "DD/MM/YYYY").toDate(),
    moment("28/02/2022", "DD/MM/YYYY").toDate(),
  ]);
  const classes = useStyles();

  const [cid, setCid] = React.useState("TODOS");
  const [previsaoPath, setPrevisaoPath] = React.useState("5");
  const [sazonalidade, setSazonalidade] = React.useState("90");

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

  // qtd_dias_previsao, qtd_dias_sazonalidade, cid
  const treinarModelo = async () => {
    try {
      const response = await axios.post(
        "https://datasaude-api-ml.beloni.dev.br/api/temporal/treinar",
        null, // Sem payload no corpo da requisição
        {
          params: {
            qtd_dias_previsao: 5,
            qtd_dias_sazonalidade: 90,
            cid: "TODOS",
          },
        }
      );

      console.log("Resposta da API:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
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

  const handleTreinarClick = () => {
    console.log("Atualizando");
    treinarModelo();
  };

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
                    <Typography>Dias previsão:</Typography>
                    <Input
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
                    <Typography>Dias sazonalidade:</Typography>
                    <Input
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
                    <Typography>CID:</Typography>
                    <Input
                      disabled
                      type="number"
                      id="cid"
                      name="cid"
                      value={cid}
                      onChange={handleCidChange}
                    ></Input>
                  </div>
                  <div
                    style={{
                      paddingLeft: "20px",
                      paddingRight: "500px",
                    }}
                  >
                    <Button
                      color="primary"
                      variant="text"
                      onClick={handleTreinarClick}
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
    </div>
  );
}
