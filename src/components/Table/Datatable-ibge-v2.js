import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Alert,
  Autocomplete,
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
import {
  buildDynamicColumns,
  buildFormulaColumns,
  getDefaultSelectedColumns,
} from "./ibgeV2Helper";
import {
  createIbgeFormula,
  deleteIbgeFormula,
  listIbgeFormulas,
  postIbgeMongoList,
} from "services/IbgeV2Service";

const PAGE_SIZE_DEFAULT = 10;
const DEFAULT_COLLECTION_MANIFEST_PATH = "/ibge-v2/index.json";

function DataTableIbgeV2Component() {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collectionColumns, setCollectionColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [columnsLoading, setColumnsLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE_DEFAULT,
  });
  const [cdSetorFilter, setCdSetorFilter] = useState("");
  const [formulas, setFormulas] = useState([]);
  const [formulasLoading, setFormulasLoading] = useState(false);
  const [formulaDialogOpen, setFormulaDialogOpen] = useState(false);
  const [formulaNome, setFormulaNome] = useState("");
  const [formulaExpressao, setFormulaExpressao] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formulaColumns = useMemo(() => buildFormulaColumns(formulas), [
    formulas,
  ]);
  const collectionColumnDefs = useMemo(
    () => buildDynamicColumns(collectionColumns),
    [collectionColumns]
  );
  const allColumns = useMemo(() => {
    const merged = [...collectionColumnDefs, ...formulaColumns];
    const seen = new Set();
    return merged.filter((column) => {
      if (seen.has(column.field)) {
        return false;
      }
      seen.add(column.field);
      return true;
    });
  }, [collectionColumnDefs, formulaColumns]);

  const selectedCollectionFile = useMemo(
    () =>
      collections.find((collection) => collection.value === selectedCollection),
    [collections, selectedCollection]
  );

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
    let active = true;

    const loadCollections = async () => {
      setCollectionsLoading(true);
      try {
        const response = await fetch(DEFAULT_COLLECTION_MANIFEST_PATH);
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}`);
        }
        const data = await response.json();
        if (!active) {
          return;
        }

        const normalized = Array.isArray(data) ? data : [];
        setCollections(normalized);
        setSelectedCollection(
          (current) => current || normalized[0]?.value || ""
        );
      } catch (error) {
        if (!active) {
          return;
        }
        setCollections([]);
        setErrorMessage("Erro ao carregar a lista de collections do IBGE V2.");
      } finally {
        if (active) {
          setCollectionsLoading(false);
        }
      }
    };

    loadCollections();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadCollectionColumns = async () => {
      if (!selectedCollectionFile?.file) {
        setCollectionColumns([]);
        return;
      }

      setColumnsLoading(true);
      try {
        const response = await fetch(selectedCollectionFile.file);
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!active) {
          return;
        }

        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.columns)
          ? data.columns
          : [];
        setCollectionColumns(normalized);
      } catch (error) {
        if (!active) {
          return;
        }
        setCollectionColumns([]);
        setErrorMessage(
          "Erro ao carregar as colunas da collection selecionada."
        );
      } finally {
        if (active) {
          setColumnsLoading(false);
        }
      }
    };

    loadCollectionColumns();

    return () => {
      active = false;
    };
  }, [selectedCollectionFile]);

  useEffect(() => {
    setSelectedColumns(getDefaultSelectedColumns(collectionColumns));
  }, [selectedCollection, collectionColumns]);

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

  const handleCollectionChange = (event) => {
    setSelectedCollection(event.target.value);
    setPaginationModel((current) => ({
      ...current,
      page: 0,
    }));
  };

  const handleColumnsChange = (event) => {
    const value = event.target.value;
    setSelectedColumns(typeof value === "string" ? value.split(",") : value);
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
        collection_name: selectedCollection,
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
      setFormulas(response?.payload || []);
    } catch (error) {
      setErrorMessage("Não foi possível remover a fórmula.");
    }
  };

  useEffect(() => {
    let active = true;

    const fetchRows = async () => {
      if (
        !selectedCollection ||
        collectionColumns.length === 0 ||
        selectedColumns.length === 0
      ) {
        return;
      }

      setLoading(true);
      try {
        const requestBody = {
          collection_name: selectedCollection,
          columns: selectedColumns,
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          ...(cdSetorFilter.trim() ? { cd_setor: cdSetorFilter.trim() } : {}),
        };

        const data = await postIbgeMongoList(requestBody);

        if (!active) {
          return;
        }

        setRows(Array.isArray(data?.payload) ? data.payload : []);
        setRowCount(data?.total_records || 0);
      } catch (error) {
        if (!active) {
          return;
        }

        setRows([]);
        setRowCount(0);
        setErrorMessage("Erro ao carregar tabela IBGE V2.");
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
    selectedCollection,
    collectionColumns.length,
    selectedColumns,
    paginationModel.page,
    paginationModel.pageSize,
    cdSetorFilter,
    formulas,
  ]);

  const currentCollectionFormulas = useMemo(
    () =>
      formulas.filter(
        (formula) =>
          !formula.collection_name ||
          formula.collection_name === selectedCollection
      ),
    [formulas, selectedCollection]
  );

  return (
    <Stack spacing={2} sx={{ width: "100%", minHeight: 650 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Box sx={{ maxWidth: 280, width: "100%" }}>
          <FormControl fullWidth size="small">
            <InputLabel id="ibge-v2-collection-label">Collection</InputLabel>
            <Select
              labelId="ibge-v2-collection-label"
              id="ibge-v2-collection"
              value={selectedCollection}
              onChange={handleCollectionChange}
              label="Collection"
            >
              {collections.map((collection) => (
                <MenuItem key={collection.value} value={collection.value}>
                  {collection.label || collection.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ maxWidth: 460, width: "100%" }}>
          <FormControl fullWidth size="small">
            <InputLabel id="ibge-v2-columns-label">Colunas exibidas</InputLabel>
            <Select
              labelId="ibge-v2-columns-label"
              id="ibge-v2-columns"
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

        <Box sx={{ maxWidth: 260, width: "100%" }}>
          <TextField
            label="cd_setor"
            value={cdSetorFilter}
            onChange={(event) => {
              setCdSetorFilter(event.target.value);
              setPaginationModel((current) => ({
                ...current,
                page: 0,
              }));
            }}
            fullWidth
            size="small"
            placeholder="Opcional"
          />
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

      {(errorMessage || collectionsLoading || columnsLoading) && (
        <Alert severity={errorMessage ? "error" : "info"}>
          {errorMessage || "Carregando collections e colunas do IBGE V2."}
        </Alert>
      )}

      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          getRowId={(row) => row.cd_setor}
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
              label="Nome do campo"
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
              Digite a fórmula e use autocomplete para campos da collection IBGE
              V2.
            </Typography>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Fórmulas cadastradas</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {currentCollectionFormulas.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma fórmula cadastrada para esta collection.
                  </Typography>
                )}
                {currentCollectionFormulas.map((formula) => (
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

export default DataTableIbgeV2Component;
