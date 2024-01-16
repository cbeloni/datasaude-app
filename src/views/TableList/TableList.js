import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import DataTableComponent from "components/Table/Datatable";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import styles from "layouts/Styles/commom.js";
import PoluentesHelper from "views/TableList/PoluentesHelper";
import DataTablePacienteComponent from "components/Table/Datatable-Paciente";

const useStyles = makeStyles(styles);
const poluentesHelper = PoluentesHelper();

export default function TableList() {
  const [value, setValue] = useState("paciente");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = useStyles();
  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Poluente online" value="poluente-online" />
          <Tab label="Paciente" value="paciente" />
        </TabList>
      </Box>
      <TabPanel value="poluente-online" className={classes.tabPanelBorder}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Online poluente</h4>
                <p className={classes.cardCategoryWhite}>
                  Coletas em cada uma hora
                </p>
              </CardHeader>
              <CardBody>
                <DataTableComponent
                  poluentesHelper={poluentesHelper}
                ></DataTableComponent>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </TabPanel>
      <TabPanel value="paciente" className={classes.tabPanelBorder}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Pacientes</h4>
                <p className={classes.cardCategoryWhite}>
                  Pacientes com dados dos poluentes coletados
                </p>
              </CardHeader>
              <CardBody>
                <DataTablePacienteComponent></DataTablePacienteComponent>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </TabPanel>
    </TabContext>
  );
}
