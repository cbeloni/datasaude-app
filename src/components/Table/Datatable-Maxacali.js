import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { maxacaliColumns } from "./MaxacaliHelper";

const PAGE_SIZE_DEFAULT = 10;
const CALCULO_UM_FIELD = "calculo_um";
const CALCULO_UM_DEPENDENCIES = ["v00047", "v0003"];
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
  "calculo_um",
];

function DataTableMaxacaliComponent() {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(
    DEFAULT_SELECTED_COLUMNS
  );
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE_DEFAULT,
  });

  const endpoint = useMemo(
    () => `${process.env.REACT_APP_API_URL}/api/v1/maxacali/listar`,
    []
  );
  const columnVisibilityModel = useMemo(
    () =>
      maxacaliColumns.reduce((acc, column) => {
        acc[column.field] = selectedColumns.includes(column.field);
        return acc;
      }, {}),
    [selectedColumns]
  );
  const selectedRequestColumns = useMemo(() => {
    const fields = [...selectedColumns];
    if (fields.includes(CALCULO_UM_FIELD)) {
      CALCULO_UM_DEPENDENCIES.forEach((dependency) => {
        if (!fields.includes(dependency)) {
          fields.push(dependency);
        }
      });
    }

    return fields;
  }, [selectedColumns]);

  const handleColumnsChange = (event) => {
    const value = event.target.value;
    setSelectedColumns(typeof value === "string" ? value.split(",") : value);
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

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!active) {
          return;
        }

        const payloadRows = data?.payload || [];
        const rowsWithCalculoUm = payloadRows.map((row) => {
          const v00047 = Number(row.v00047);
          const v0003 = Number(row.v0003);
          const calculoUm =
            Number.isFinite(v00047) && Number.isFinite(v0003) && v0003 !== 0
              ? (v00047 / v0003) * 100
              : null;

          return {
            ...row,
            calculo_um: calculoUm,
          };
        });

        setRows(rowsWithCalculoUm);
        setRowCount(data?.totalRecordCount || 0);
      } catch (error) {
        if (!active) {
          return;
        }

        console.error("Erro ao carregar tabela Maxacali", error);
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
    selectedRequestColumns,
  ]);

  return (
    <div style={{ width: "100%", height: 650 }}>
      <Box
        style={{
          paddingBottom: "12px",
          maxWidth: "270px",
        }}
      >
        <FormControl fullWidth size="small">
          <InputLabel id="maxacali-columns-label">Colunas exibidas</InputLabel>
          <Select
            labelId="maxacali-columns-label"
            id="maxacali-columns"
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
                        maxacaliColumns.find((column) => column.field === field)
                          ?.headerName || field
                    )
                    .join(", ")
            }
          >
            {maxacaliColumns.map((column) => (
              <MenuItem key={column.field} value={column.field}>
                {column.headerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <DataGrid
        rows={rows}
        columns={maxacaliColumns}
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

export default DataTableMaxacaliComponent;
