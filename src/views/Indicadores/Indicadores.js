import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import CardIcon from "components/Card/CardIcon.js";
import { CheckCircle, Update } from "@material-ui/icons";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import Card from "components/Card/Card.js";
import TickPlacementBars from "components/Graph/CustomGraph";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();

  const getCardColor = (qualidade) => {
    const colorMap = {
      "N1 - BOA": "success",
      "N2 - MODERADA": "warning",
      "N3 - RUIM": "danger",
      "N4 - MUITO RUIM": "rose",
    };

    return colorMap[qualidade] || "warning"; // Retorna a cor mapeada ou "rose" se não houver correspondência
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color={getCardColor("N1 - BOA")} stats icon>
              <CardIcon color={getCardColor("N1 - BOA")}>
                <CheckCircle></CheckCircle>
              </CardIcon>
              <p className={classes.cardCategory}>GRÁFICO</p>
            </CardHeader>
            <CardBody>
              <p className={classes.CardBody}>
                <TickPlacementBars></TickPlacementBars>
              </p>
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                <p>Dados rodapé</p>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
