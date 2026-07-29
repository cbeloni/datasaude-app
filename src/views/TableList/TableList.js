import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Card, Tab, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import PageHeader from "components/Card/PageHeader";
import DataTableComponent from "components/Table/Datatable";
import DataTablePacienteComponent from "components/Table/Datatable-Paciente";
import DataTableIbgeComponent from "components/Table/Datatable-ibge";
import DataTableIbgeV2Component from "components/Table/Datatable-ibge-v2";
import PoluentesHelper from "views/TableList/PoluentesHelper";
import { TABLE_TAB_PERMISSIONS } from "config/tabPermissions";

const poluentesHelper = PoluentesHelper();

const TABS = [
  {
    ...TABLE_TAB_PERMISSIONS[0],
    description: "Pacientes com dados dos poluentes coletados.",
    Component: DataTablePacienteComponent,
  },
  {
    ...TABLE_TAB_PERMISSIONS[1],
    description: "Coletas a cada uma hora.",
    Component: () => <DataTableComponent poluentesHelper={poluentesHelper} />,
  },
  {
    ...TABLE_TAB_PERMISSIONS[2],
    description: "Tabela baseada no dataset de setores do IBGE.",
    Component: DataTableIbgeComponent,
  },
  {
    ...TABLE_TAB_PERMISSIONS[3],
    description: "Tabela IBGE com collections MongoDB e colunas dinâmicas.",
    Component: DataTableIbgeV2Component,
  },
];

const getAvailableTabs = (permissions, isAdmin) => {
  if (isAdmin) return TABS;
  return TABS.filter((tab) => permissions.includes(tab.code));
};

export default function TableList({ permissions = [], isAdmin = false }) {
  const [value, setValue] = useState("ibge-v2");
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
        <PageHeader eyebrow="Tabelas" title="Conjuntos de dados" />
        <Typography color="text.secondary">
          Você não possui permissão para acessar nenhuma tabela.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        eyebrow="Tabelas"
        title="Conjuntos de dados"
        description={active?.description}
      />

      <Card variant="outlined" sx={{ overflow: "hidden" }}>
        <TabContext value={activeValue || "none"}>
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
              {availableTabs.map((t) => (
                <Tab key={t.value} label={t.label} value={t.value} />
              ))}
            </TabList>
          </Box>
          {availableTabs.map(({ value: v, Component }) => (
            <TabPanel key={v} value={v} sx={{ p: 2.5 }}>
              <Component />
            </TabPanel>
          ))}
        </TabContext>
      </Card>
    </Box>
  );
}

TableList.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  isAdmin: PropTypes.bool,
};
