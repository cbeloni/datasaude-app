import React from "react";
import IframeTable from "components/Table/IframeTable";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { makeStyles } from "@material-ui/core/styles";
import styles from "layouts/Styles/commom.js";

const useStyles = makeStyles(styles);
const Maps = () => {
  const classes = useStyles();
  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Mapa poluente MP10</h4>
              <p className={classes.cardCategoryWhite}>Média poluentes 2023</p>
            </CardHeader>
            <CardBody>
              <IframeTable></IframeTable>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
};

export default Maps;
