import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Card, Tab, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import PageHeader from "components/Card/PageHeader";
import IframeMap from "components/Map/IframeMap";
import ReactMap2 from "components/Map/ReactMap2";
import ReactMapIbge from "components/Map/ReactMapibge";
import ReactMapIbgeV2 from "components/Map/ReactMapIbgeV2";
import ReactMapBronquiolite from "components/Map/ReactMapBronquiolite";
import ReactMapBronquioliteVsr from "components/Map/ReactMapBronquioliteVsr";
import { MAP_TAB_PERMISSIONS } from "config/tabPermissions";

const TABS = [
  {
    ...MAP_TAB_PERMISSIONS[0],
    description: "Visualize poluentes e CIDs com filtro temporal.",
    Component: ReactMap2,
  },
  {
    ...MAP_TAB_PERMISSIONS[1],
    description: "Casos de bronquiolite por município.",
    Component: ReactMapBronquiolite,
  },
  {
    ...MAP_TAB_PERMISSIONS[2],
    description: "Camada krigada de poluentes (snapshot anual).",
    Component: IframeMap,
  },
  {
    ...MAP_TAB_PERMISSIONS[3],
    description: "Setores e indicadores do IBGE.",
    Component: ReactMapIbge,
  },
  {
    ...MAP_TAB_PERMISSIONS[4],
    description: "Setores IBGE com collection e campo dinâmicos.",
    Component: ReactMapIbgeV2,
  },
  {
    ...MAP_TAB_PERMISSIONS[5],
    description: "Atendimentos de bronquiolite com indicadores de UTI e VSR.",
    Component: ReactMapBronquioliteVsr,
  },
];

const getAvailableTabs = (permissions, isAdmin) => {
  if (isAdmin) return TABS;
  return TABS.filter((tab) => permissions.includes(tab.code));
};

const Maps = ({ permissions = [], isAdmin = false }) => {
  const [value, setValue] = useState("map_dinamic");
  const availableTabs = getAvailableTabs(permissions, isAdmin);
  const activeValue = availableTabs.some((tab) => tab.value === value)
    ? value
    : availableTabs[0]?.value;

  useEffect(() => {
    if (activeValue && activeValue !== value) setValue(activeValue);
  }, [activeValue, value]);

  const handleChange = (_, newValue) => setValue(newValue);
  const active = availableTabs.find((t) => t.value === activeValue);

  if (!availableTabs.length) {
    return (
      <Box>
        <PageHeader eyebrow="Geoespacial" title="Mapas de saúde" />
        <Typography color="text.secondary">
          Você não possui permissão para acessar nenhum mapa.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        eyebrow="Geoespacial"
        title="Mapas de saúde"
        description={active?.description}
      />

      <Card variant="outlined" sx={{ overflow: "hidden" }}>
        <TabContext value={activeValue || "none"}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
            <TabList
              onChange={handleChange}
              aria-label="seletor de mapa"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 48,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  minHeight: 48,
                  px: 2,
                },
              }}
            >
              {availableTabs.map((t) => (
                <Tab key={t.value} label={t.label} value={t.value} />
              ))}
            </TabList>
          </Box>
          {availableTabs.map(({ value: v, Component }) => (
            <TabPanel
              key={v}
              value={v}
              sx={{ p: { xs: 1.5, md: 2.5 }, minHeight: 480 }}
            >
              <Component />
            </TabPanel>
          ))}
        </TabContext>
      </Card>
    </Box>
  );
};

export default Maps;

Maps.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  isAdmin: PropTypes.bool,
};
