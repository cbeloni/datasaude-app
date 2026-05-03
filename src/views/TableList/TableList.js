import React, { useState } from "react";
import { Box, Card, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import PageHeader from "components/Card/PageHeader";
import DataTableComponent from "components/Table/Datatable";
import DataTablePacienteComponent from "components/Table/Datatable-Paciente";
import DataTableMaxacaliComponent from "components/Table/Datatable-Maxacali";
import PoluentesHelper from "views/TableList/PoluentesHelper";

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
  const [value, setValue] = useState("paciente");
  const handleChange = (_, newValue) => setValue(newValue);
  const active = TABS.find((t) => t.value === value);

  return (
    <Box>
      <PageHeader
        eyebrow="Tabelas"
        title="Conjuntos de dados"
        description={active?.description}
      />

      <Card variant="outlined" sx={{ overflow: "hidden" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
            <TabList
              onChange={handleChange}
              aria-label="seletor de tabela"
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
            <TabPanel key={v} value={v} sx={{ p: 2.5 }}>
              <Component />
            </TabPanel>
          ))}
        </TabContext>
      </Card>
    </Box>
  );
}
