import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Autocomplete,
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { buildFormulaColumns, ibgeColumns } from "./ibgeHelper";
import {
  createIbgeFormula,
  deleteIbgeFormula,
  listIbgeFormulas,
  postIbgeList,
} from "services/IbgeService";

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
  const [formulas, setFormulas] = useState([]);
  const [formulasLoading, setFormulasLoading] = useState(false);
  const [formulaDialogOpen, setFormulaDialogOpen] = useState(false);
  const [formulaNome, setFormulaNome] = useState("");
  const [formulaExpressao, setFormulaExpressao] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formulaColumns = useMemo(() => buildFormulaColumns(formulas), [
    formulas,
  ]);
  const allColumns = useMemo(() => [...ibgeColumns, ...formulaColumns], [
    formulaColumns,
  ]);

  const loadFormulas = useCallback(async () => {
    setFormulasLoading(true);
    try {
      const response = await listIbgeFormulas();
      setFormulas(response?.payload || []);
    } catch (error) {
      setErrorMessage("Erro ao carregar fórmulas customizadas.");
      setFormulas([]);
    } finally {
      setFormulasLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFormulas();
  }, [loadFormulas]);

  useEffect(() => {
    setSelectedColumns((current) => {
      const validFields = new Set(allColumns.map((column) => column.field));
      return current.filter((field) => validFields.has(field));
    });
  }, [allColumns]);

  const columnVisibilityModel = useMemo(
    () =>
      allColumns.reduce((acc, column) => {
        acc[column.field] = selectedColumns.includes(column.field);
        return acc;
      }, {}),
    [allColumns, selectedColumns]
  );
  const formulaFieldOptions = useMemo(
    () =>
      Array.from(
        new Set(allColumns.map((column) => column.field.toUpperCase()))
      ),
    [allColumns]
  );
  const currentFormulaToken = useMemo(() => {
    const match = formulaExpressao.match(/[a-zA-Z_][a-zA-Z0-9_]*$/);
    return match ? match[0].toUpperCase() : "";
  }, [formulaExpressao]);
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

  const handleFormulaSuggestionSelect = (_, selectedField) => {
    if (!selectedField) {
      return;
    }

    setFormulaExpressao((current) => {
      if (/[a-zA-Z_][a-zA-Z0-9_]*$/.test(current)) {
        return current.replace(/[a-zA-Z_][a-zA-Z0-9_]*$/, selectedField);
      }

      return `${current}${selectedField}`;
    });
  };

  const handleFormulaInputChange = (_, value, reason) => {
    if (reason === "input" || reason === "clear") {
      setFormulaExpressao(value);
    }
  };

  const handleCreateFormula = async () => {
    setErrorMessage("");

    if (!formulaNome.trim() || !formulaExpressao.trim()) {
      setErrorMessage("Preencha nome e fórmula.");
      return;
    }

    try {
      const response = await createIbgeFormula({
        nome: formulaNome.trim(),
        formula: formulaExpressao.trim(),
      });
      setFormulas(response?.payload || []);
      setFormulaDialogOpen(false);
      setFormulaNome("");
      setFormulaExpressao("");
      setPaginationModel((current) => ({ ...current, page: 0 }));
    } catch (error) {
      setErrorMessage("Não foi possível salvar a fórmula.");
    }
  };

  const handleDeleteFormula = async (formulaId, formulaName) => {
    const confirmed = window.confirm(
      `Remover a fórmula customizada "${formulaName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteIbgeFormula(formulaId);
      const updatedFormulas = response?.payload || [];
      setFormulas(updatedFormulas);
      const removedField = formulaName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
      setSelectedColumns((current) =>
        current.filter((field) => field !== removedField)
      );
    } catch (error) {
      setErrorMessage("Não foi possível remover a fórmula.");
    }
  };

  useEffect(() => {
    let active = true;

    const fetchRows = async () => {
      setLoading(true);
      try {
        const requestBody = {
          take: paginationModel.pageSize,
          prev: null,
          skip: paginationModel.page * paginationModel.pageSize,
          columns: selectedColumns,
          ...(selectedFilter === FILTER_SETOR
            ? { cd_setor: IBGE_SETOR_FILTER }
            : {}),
        };

        const data = await postIbgeList(requestBody);

        if (!active) {
          return;
        }

        const payloadRows = data?.payload || data?.Payload || data?.data || [];
        const totalRecords =
          data?.totalRecordCount ||
          data?.TotalRecordCount ||
          (Array.isArray(payloadRows) ? payloadRows.length : 0);

        setRows(Array.isArray(payloadRows) ? payloadRows : []);
        setRowCount(totalRecords);
      } catch (error) {
        if (!active) {
          return;
        }

        setRows([]);
        setRowCount(0);
        setErrorMessage("Erro ao carregar tabela IBGE.");
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
    paginationModel.page,
    paginationModel.pageSize,
    selectedColumns,
    selectedFilter,
  ]);

  return (
    <Stack spacing={2} sx={{ width: "100%", minHeight: 650 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Box sx={{ maxWidth: 420, width: "100%" }}>
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
              MenuProps={{ PaperProps: { sx: { maxHeight: 360 } } }}
              renderValue={(selected) =>
                selected.length === 0
                  ? "Nenhuma coluna"
                  : selected
                      .map(
                        (field) =>
                          allColumns.find((column) => column.field === field)
                            ?.headerName || field
                      )
                      .join(", ")
              }
            >
              {allColumns.map((column) => (
                <MenuItem key={column.field} value={column.field}>
                  {column.headerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ maxWidth: 220, width: "100%" }}>
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
              <MenuItem value={FILTER_SETOR}>Maxacali</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            onClick={() => setFormulaDialogOpen(true)}
          >
            Fórmula customizada
          </Button>
        </Stack>
      </Stack>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={allColumns}
          columnVisibilityModel={columnVisibilityModel}
          rowCount={rowCount}
          loading={loading || formulasLoading}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog
        open={formulaDialogOpen}
        onClose={() => setFormulaDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Fórmulas customizadas</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome da campo"
              value={formulaNome}
              onChange={(event) => setFormulaNome(event.target.value)}
              fullWidth
            />
            <Autocomplete
              freeSolo
              options={filteredFormulaOptions}
              inputValue={formulaExpressao}
              onInputChange={handleFormulaInputChange}
              onChange={handleFormulaSuggestionSelect}
              filterOptions={(options) => options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Fórmula"
                  placeholder="Ex: (V00047 / V0003) * 100"
                  fullWidth
                />
              )}
            />
            <Typography variant="caption" color="text.secondary">
              Digite a fórmula e use autocomplete para campos da tabela IBGE.
            </Typography>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Fórmulas cadastradas</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {formulas.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma fórmula cadastrada.
                  </Typography>
                )}
                {formulas.map((formula) => (
                  <Box
                    key={formula.id}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="caption">
                      <b>{formula.nome}:</b> {formula.formula}
                    </Typography>
                    <Tooltip title="Remover fórmula">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDeleteFormula(formula.id, formula.nome)
                        }
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormulaDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateFormula}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default DataTableIbgeComponent;
