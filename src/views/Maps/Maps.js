import React, { useState } from "react";
import { Box, Card, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import PageHeader from "components/Card/PageHeader";
import IframeMap from "components/Map/IframeMap";
import ReactMap2 from "components/Map/ReactMap2";
import ReactMapMaxacali from "components/Map/ReactMapMaxacali";
import ReactMapBronquiolite from "components/Map/ReactMapBronquiolite";

const TABS = [
  {
    value: "map_dinamic",
    label: "Mapa dinâmico",
    description: "Visualize poluentes e CIDs com filtro temporal.",
    Component: ReactMap2,
  },
  {
    value: "map_bronquiolite",
    label: "Bronquiolite",
    description: "Casos de bronquiolite por município.",
    Component: ReactMapBronquiolite,
  },
  {
    value: "map_estatic",
    label: "Mapa estático",
    description: "Camada krigada de poluentes (snapshot anual).",
    Component: IframeMap,
  },
  {
    value: "map_maxacali",
    label: "Maxacali",
    description: "Setores e indicadores do Maxacali.",
    Component: ReactMapMaxacali,
  },
];

const Maps = () => {
  const [value, setValue] = useState("map_dinamic");
  const handleChange = (_, newValue) => setValue(newValue);
  const active = TABS.find((t) => t.value === value);

  return (
    <Box>
      <PageHeader
        eyebrow="Geoespacial"
        title="Mapas de saúde"
        description={active?.description}
      />

      <Card variant="outlined" sx={{ overflow: "hidden" }}>
        <TabContext value={value}>
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
              {TABS.map((t) => (
                <Tab key={t.value} label={t.label} value={t.value} />
              ))}
            </TabList>
          </Box>
          {TABS.map(({ value: v, Component }) => (
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
