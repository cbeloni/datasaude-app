import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ibgeColumns } from "./ibgeHelper";

const PAGE_SIZE_DEFAULT = 10;
const FILTER_ALL = "todos";
const FILTER_SETOR = "maxacali";
const IBGE_SETOR_FILTER = [
  "310660620000007",
  "310660620000011",
  "310660620000012",
  "315765805000014",
  "315765805000015",
  "315765805000016",
  "315765805000017",
  "310660620000013",
];

const DEFAULT_SELECTED_COLUMNS = [
  "id",
  "cd_setor",
  "situacao",
  "cd_sit",
  "cd_tipo",
  "area_km2",
  "cd_regiao",
  "nm_regiao",
  "cd_uf",
  "nm_uf",
  "percentual_domicios_ocupados",
  "percentual_pessoas",
];

function DataTableIbgeComponent() {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(
    DEFAULT_SELECTED_COLUMNS
  );
  const [selectedFilter, setSelectedFilter] = useState(FILTER_ALL);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE_DEFAULT,
  });

  const endpoint = useMemo(
    () => `${process.env.REACT_APP_API_URL}/api/v1/ibge/listar`,
    []
  );
  const columnVisibilityModel = useMemo(
    () =>
      ibgeColumns.reduce((acc, column) => {
        acc[column.field] = selectedColumns.includes(column.field);
        return acc;
      }, {}),
    [selectedColumns]
  );
  const selectedRequestColumns = useMemo(() => {
    return [...selectedColumns];
  }, [selectedColumns]);

  const handleColumnsChange = (event) => {
    const value = event.target.value;
    setSelectedColumns(typeof value === "string" ? value.split(",") : value);
    setPaginationModel((current) => ({
      ...current,
      page: 0,
    }));
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
    setPaginationModel((current) => ({
      ...current,
      page: 0,
    }));
  };

  useEffect(() => {
    let active = true;

    const fetchRows = async () => {
      setLoading(true);
      try {
        const payload = {
          take: paginationModel.pageSize,
          prev: null,
          skip: paginationModel.page * paginationModel.pageSize,
          columns: selectedRequestColumns,
        };

        const requestBody =
          selectedFilter === FILTER_SETOR
            ? {
                payload: {
                  take: 10,
                  prev: 0,
                  skip: 0,
                },
                cd_setor: IBGE_SETOR_FILTER,
              }
            : payload;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!active) {
          return;
        }

        const payloadRows = data?.payload || [];
        setRows(payloadRows);
        setRowCount(data?.totalRecordCount || 0);
      } catch (error) {
        if (!active) {
          return;
        }

        console.error("Erro ao carregar tabela IBGE", error);
        setRows([]);
        setRowCount(0);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchRows();

    return () => {
      active = false;
    };
  }, [
    endpoint,
    paginationModel.page,
    paginationModel.pageSize,
    selectedFilter,
    selectedRequestColumns,
  ]);

  return (
    <div style={{ width: "100%", height: 650 }}>
      <Box
        style={{
          paddingBottom: "12px",
          display: "flex",
          gap: "8px",
          maxWidth: "700px",
        }}
      >
        <FormControl fullWidth size="small">
          <InputLabel id="ibge-columns-label">Colunas exibidas</InputLabel>
          <Select
            labelId="ibge-columns-label"
            id="ibge-columns"
            multiple
            value={selectedColumns}
            onChange={handleColumnsChange}
            label="Colunas exibidas"
            displayEmpty
            renderValue={(selected) =>
              selected.length === 0
                ? "Nenhuma coluna"
                : selected
                    .map(
                      (field) =>
                        ibgeColumns.find((column) => column.field === field)
                          ?.headerName || field
                    )
                    .join(", ")
            }
          >
            {ibgeColumns.map((column) => (
              <MenuItem key={column.field} value={column.field}>
                {column.headerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel id="ibge-filter-label">Setor</InputLabel>
          <Select
            labelId="ibge-filter-label"
            id="ibge-filter"
            value={selectedFilter}
            onChange={handleFilterChange}
            label="Setor"
          >
            <MenuItem value={FILTER_ALL}>Todos</MenuItem>
            <MenuItem value={FILTER_SETOR}>maxacali</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DataGrid
        rows={rows}
        columns={ibgeColumns}
        columnVisibilityModel={columnVisibilityModel}
        rowCount={rowCount}
        loading={loading}
        pagination
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
      />
    </div>
  );
}

export default DataTableIbgeComponent;
