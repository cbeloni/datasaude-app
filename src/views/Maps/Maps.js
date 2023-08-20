import React, { useState } from "react";
import IframeTable from "components/Table/IframeTable";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import styles from "layouts/Styles/commom.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

const Maps = () => {
  const [value, setValue] = useState("map_estatic");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();
  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="mapa estático" value="map_estatic" />
          <Tab label="mapa dinâmico" value="map_dinamic" />
        </TabList>
      </Box>
      <TabPanel value="map_estatic" className={classes.tabPanelBorder}>
        <IframeTable></IframeTable>
      </TabPanel>
      <TabPanel value="map_dinamic" className={classes.tabPanelBorder}>
        <p>Mapa dinâmico</p>
      </TabPanel>
    </TabContext>
  );
};

export default Maps;
