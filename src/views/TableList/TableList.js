import React, { useState } from "react";
import { Box, Card, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import PageHeader from "components/Card/PageHeader";
import DataTableComponent from "components/Table/Datatable";
import DataTablePacienteComponent from "components/Table/Datatable-Paciente";
import DataTableIbgeComponent from "components/Table/Datatable-ibge";

const poluentesHelper = PoluentesHelper();

const TABS = [
  {
    value: "paciente",
    label: "Pacientes",
    description: "Pacientes com dados dos poluentes coletados.",
    Component: DataTablePacienteComponent,
  },
  {
    value: "poluente-online",
    label: "Poluente online",
    description: "Coletas a cada uma hora.",
    Component: () => <DataTableComponent poluentesHelper={poluentesHelper} />,
  },
  {
    value: "maxacali",
    label: "Maxacali",
    description: "Tabela baseada no dataset de setores do Maxacali.",
    Component: DataTableMaxacaliComponent,
  },
];

export default function TableList() {
  const [value, setValue] = useState("ibge");

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
          <Tab label="IBGE" value="ibge" />
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
      <TabPanel value="ibge" className={classes.tabPanelBorder}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>IBGE</h4>
                <p className={classes.cardCategoryWhite}>
                  Tabela baseada no dataset de setores do IBGE
                </p>
              </CardHeader>
              <CardBody>
                <DataTableIbgeComponent></DataTableIbgeComponent>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </TabPanel>
    </TabContext>
  );
}
