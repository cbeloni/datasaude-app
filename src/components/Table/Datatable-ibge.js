import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ibgeColumns } from "./ibgeHelper";

const PAGE_SIZE_DEFAULT = 10;
const FILTER_ALL = "todos";
const FILTER_SETOR = "maxacali";
const CUSTOM_FIELD_PREFIX = "custom_formula_";
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

const IBGE_FIELDS = new Set(ibgeColumns.map((column) => column.field));

const sanitizeFormula = (formula) => {
  return formula.replace(/\s+/g, "").toLowerCase();
};

const extractFormulaFields = (formula) => {
  return Array.from(
    new Set((formula.match(/[a-z_][a-z0-9_]*/g) || []).map((field) => field))
  );
};

const calculateFormula = (formula, row) => {
  const expression = sanitizeFormula(formula).replace(
    /[a-z_][a-z0-9_]*/g,
    (field) => {
      const value = Number(row[field]);
      return Number.isFinite(value) ? `${value}` : "0";
    }
  );

  if (!/^[0-9+\-*/().]+$/.test(expression)) {
    return null;
  }

  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expression});`)();
    return Number.isFinite(result) ? result : null;
  } catch (error) {
    return null;
  }
};

function DataTableIbgeComponent() {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(
    DEFAULT_SELECTED_COLUMNS
  );
  const [selectedFilter, setSelectedFilter] = useState(FILTER_ALL);
  const [formulaInput, setFormulaInput] = useState("");
  const [formulaError, setFormulaError] = useState("");
  const [customFields, setCustomFields] = useState([]);
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
  const dataGridColumns = useMemo(() => {
    const customColumns = customFields.map((field) => ({
      field: field.id,
      headerName: field.name,
      width: 170,
      sortable: false,
      valueGetter: (params) => calculateFormula(field.formula, params.row),
    }));

    return [...ibgeColumns, ...customColumns];
  }, [customFields]);
  const formulaFieldOptions = useMemo(() => {
    return ibgeColumns.map((column) => column.field.toUpperCase());
  }, []);
  const currentFormulaToken = useMemo(() => {
    const match = formulaInput.match(/[a-zA-Z_][a-zA-Z0-9_]*$/);
    return match ? match[0].toUpperCase() : "";
  }, [formulaInput]);
  const filteredFormulaOptions = useMemo(() => {
    if (!currentFormulaToken) {
      return formulaFieldOptions;
    }

    return formulaFieldOptions.filter((field) =>
      field.startsWith(currentFormulaToken)
    );
  }, [currentFormulaToken, formulaFieldOptions]);

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

  const handleAddCustomField = () => {
    const normalizedFormula = sanitizeFormula(formulaInput);

    if (!normalizedFormula) {
      setFormulaError("Informe uma fórmula, ex.: V0001/V00047.");
      return;
    }

    if (!/^[a-z0-9_+\-*/().]+$/.test(normalizedFormula)) {
      setFormulaError("Use apenas campos, números e operadores (+ - * /).");
      return;
    }

    const formulaFields = extractFormulaFields(normalizedFormula);
    const unknownFields = formulaFields.filter(
      (field) => !IBGE_FIELDS.has(field)
    );

    if (unknownFields.length > 0) {
      setFormulaError(`Campos inválidos: ${unknownFields.join(", ")}`);
      return;
    }

    const customFieldId = `${CUSTOM_FIELD_PREFIX}${customFields.length + 1}`;
    const customField = {
      id: customFieldId,
      formula: normalizedFormula,
      name: normalizedFormula.toUpperCase(),
    };

    setCustomFields((current) => [...current, customField]);
    setSelectedColumns((current) => {
      const merged = new Set([...current, ...formulaFields]);
      return Array.from(merged);
    });
    setFormulaInput("");
    setFormulaError("");
  };

  const handleFormulaSuggestionSelect = (_, selectedField) => {
    if (!selectedField) {
      return;
    }

    setFormulaInput((current) => {
      if (/[a-zA-Z_][a-zA-Z0-9_]*$/.test(current)) {
        return current.replace(/[a-zA-Z_][a-zA-Z0-9_]*$/, selectedField);
      }

      return `${current}${selectedField}`;
    });
  };

  const handleFormulaInputChange = (_, value, reason) => {
    if (reason === "input" || reason === "clear") {
      setFormulaInput(value);
    }
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
          flexWrap: "wrap",
        }}
      >
        <FormControl
          size="small"
          style={{ minWidth: "320px", flex: "1 1 320px" }}
        >
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
        <FormControl
          size="small"
          style={{ minWidth: "220px", flex: "1 1 220px" }}
        >
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
        <Box
          style={{
            display: "flex",
            gap: "8px",
            flex: "2 1 560px",
            minWidth: "420px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Autocomplete
            freeSolo
            size="small"
            options={filteredFormulaOptions}
            inputValue={formulaInput}
            onInputChange={handleFormulaInputChange}
            onChange={handleFormulaSuggestionSelect}
            filterOptions={(options) => options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Fórmula customizada"
                placeholder="Ex.: V0001/V00047"
                error={Boolean(formulaError)}
                helperText={
                  formulaError ||
                  "Digite a fórmula e use autocomplete ao escrever o campo."
                }
              />
            )}
            style={{ minWidth: "320px", flex: "2 1 320px" }}
          />
          <Button
            variant="contained"
            onClick={handleAddCustomField}
            style={{ minWidth: "160px", height: "40px", whiteSpace: "nowrap" }}
          >
            Adicionar campo
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={rows}
        columns={dataGridColumns}
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
