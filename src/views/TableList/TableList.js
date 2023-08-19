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

const useStyles = makeStyles(styles);

export default function TableList() {
  const [value, setValue] = useState("poluente-online");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = useStyles();
  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Poluente online" value="poluente-online" />
          <Tab label="Poluente Histórico" value="poluente-historico" />
        </TabList>
      </Box>
      <TabPanel value="poluente-online" className={classes.tabPanelBorder}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Online poluente</h4>
                <p className={classes.cardCategoryWhite}>
                  coletas em cada uma hora
                </p>
              </CardHeader>
              <CardBody>
                <DataTableComponent></DataTableComponent>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </TabPanel>
      <TabPanel value="poluente-historico" className={classes.tabPanelBorder}>
        <p>poluente-historico</p>
      </TabPanel>
    </TabContext>
  );
}
