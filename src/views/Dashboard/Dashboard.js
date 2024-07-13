import React, { useEffect, useState } from "react";

// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// import Warning from "@material-ui/icons/Warning";
import Update from "@material-ui/icons/Update";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import {
  CheckCircle,
  Warning,
  PriorityHigh,
  Report,
} from "@material-ui/icons/";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import axios from "axios";
import CardBody from "components/Card/CardBody";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();

  const [data, setData] = useState();

  useEffect(() => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/v1/poluentes/cetesb?persist=false`
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getCardColor = (qualidade) => {
    const colorMap = {
      "N1 - BOA": "success",
      "N2 - MODERADA": "warning",
      "N3 - RUIM": "danger",
      "N4 - MUITO RUIM": "rose",
    };

    return colorMap[qualidade] || "warning"; // Retorna a cor mapeada ou "rose" se não houver correspondência
  };

  const getCardIcon = (qualidade) => {
    const iconMap = {
      "N1 - BOA": <CheckCircle>content_copy</CheckCircle>,
      "N2 - MODERADA": <Warning>Warning</Warning>,
      "N3 - RUIM": <PriorityHigh>PriorityHigh</PriorityHigh>,
      "N4 - MUITO RUIM": <Report>Report</Report>,
    };

    return iconMap[qualidade] || <Warning />;
  };

  return (
    <div>
      <GridContainer>
        {data &&
          data.Payload.map((card) => {
            return (
              <React.Fragment key={card.nome}>
                <GridItem xs={12} sm={6} md={3}>
                  <Card>
                    <CardHeader color={getCardColor(card.qualidade)} stats icon>
                      <CardIcon color={getCardColor(card.qualidade)}>
                        {getCardIcon(card.qualidade)}
                      </CardIcon>
                      <p className={classes.cardCategory}>{card.nome}</p>
                      <h3 className={classes.cardTitle}>{card.qualidade}</h3>
                    </CardHeader>
                    <CardBody>
                      <p className={classes.CardBody}>
                        {card.endereco} - {card.municipio}
                      </p>
                      <p className={classes.CardBody}>
                        poluente: {card.poluente}
                      </p>
                      <p className={classes.CardBody}>Índice: {card.indice}</p>
                    </CardBody>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <Update />
                        {card.data}
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>
              </React.Fragment>
            );
          })}
      </GridContainer>
    </div>
  );
}
