import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import CardIcon from "components/Card/CardIcon.js";
import { InsertChart, Update } from "@material-ui/icons";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import Card from "components/Card/Card.js";
import CustomGraphBars from "components/Graph/CustomGraph";
import DatePicker from "components/DataPicker/ReactDatePicker";
import moment from "moment";
import CustomCidGraphBars from "components/Graph/CustomCidGraph";
import CustomInternacaGraphBars from "components/Graph/CustomInternacaoGraph";
import { format } from "date-fns";
import { Typography } from "@mui/material";
import isValidDate from "utils/validators";
import CustomLeitosGraph from "components/Graph/CustomLeitosGraph";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const [dateRange, setDateRange] = React.useState([
    moment("01/01/2022", "DD/MM/YYYY").toDate(),
    moment("28/02/2022", "DD/MM/YYYY").toDate(),
  ]);
  const classes = useStyles();

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

  const getCardColor = (qualidade) => {
    const colorMap = {
      "N1 - BOA": "success",
      "N2 - MODERADA": "warning",
      "N3 - RUIM": "danger",
      "N4 - MUITO RUIM": "rose",
    };

    return colorMap[qualidade] || "warning"; // Retorna a cor mapeada ou "rose" se não houver correspondência
  };

  const atualizaData = (data) => {
    setDateRange(data);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <DatePicker value={dateRange} onChange={atualizaData} />
          </div>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color={getCardColor("N1 - BOA")} stats icon>
              <CardIcon color={getCardColor("N1 - BOA")}>
                <InsertChart></InsertChart>
              </CardIcon>
              <p className={classes.cardCategory}>
                Pacientes por data de atendimento
              </p>
            </CardHeader>
            <CardBody>
              <div className={classes.CardBody}>
                <CustomGraphBars dateRange={dateRange}></CustomGraphBars>
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
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color={getCardColor("N1 - BOA")} stats icon>
              <CardIcon color={getCardColor("N1 - BOA")}>
                <InsertChart></InsertChart>
              </CardIcon>
              <p className={classes.cardCategory}>
                Paciente por internação e alta
              </p>
            </CardHeader>
            <CardBody>
              <div className={classes.CardBody}>
                <CustomInternacaGraphBars
                  dateRange={dateRange}
                ></CustomInternacaGraphBars>
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
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color={getCardColor("N1 - BOA")} stats icon>
              <CardIcon color={getCardColor("N1 - BOA")}>
                <InsertChart></InsertChart>
              </CardIcon>
              <p className={classes.cardCategory}>Pacientes por cid</p>
            </CardHeader>
            <CardBody>
              <div className={classes.CardBody}>
                <CustomCidGraphBars dateRange={dateRange}></CustomCidGraphBars>
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
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color={getCardColor("N1 - BOA")} stats icon>
              <CardIcon color={getCardColor("N1 - BOA")}>
                <InsertChart></InsertChart>
              </CardIcon>
              <p className={classes.cardCategory}>Pacientes por cid</p>
            </CardHeader>
            <CardBody>
              <div className={classes.CardBody}>
                <CustomLeitosGraph dateRange={dateRange}></CustomLeitosGraph>
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
