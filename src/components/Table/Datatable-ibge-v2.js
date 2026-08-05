import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import DownloadIcon from "@mui/icons-material/Download";
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

function DataTableIbgeV2Component() {
  const [setorFilter, setSetorFilter] = useState(FILTER_SETOR);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collectionColumns, setCollectionColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [columnsLoading, setColumnsLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE_DEFAULT,
  });
  const [cdSetorFilter, setCdSetorFilter] = useState([]);
  const [cdSetorInputValue, setCdSetorInputValue] = useState("");
  const [setorCdSetores, setSetorCdSetores] = useState(IBGE_SETOR_FILTER);
  const [formulas, setFormulas] = useState([]);
  const [formulasLoading, setFormulasLoading] = useState(false);
  const [formulaDialogOpen, setFormulaDialogOpen] = useState(false);
  const [formulaNome, setFormulaNome] = useState("");
  const [formulaExpressao, setFormulaExpressao] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportPage, setExportPage] = useState(1);
  const [exportPageSize, setExportPageSize] = useState(2000);
  const [exporting, setExporting] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const EXPORT_PAGE_SIZE_OPTIONS = [2000, 5000, 10000, 50000];
  const exportTotalPages = useMemo(() => {
    if (totalRecords > 0) {
      return Math.max(1, Math.ceil(totalRecords / exportPageSize));
    }
    return 0;
  }, [totalRecords, exportPageSize]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  const currentCollectionFormulas = useMemo(
    () =>
      formulas.filter(
        (formula) =>
          !formula.collection_name ||
          formula.collection_name === selectedCollection
      ),
    [formulas, selectedCollection]
  );

  const formulaColumns = useMemo(
    () => buildFormulaColumns(currentCollectionFormulas),
    [currentCollectionFormulas]
  );
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

  // Mapeia cada campo de fórmula para o conjunto de campos-fonte usados na
  // sua expressão (ex.: "MEU_INDICE" -> {"V00047", "V0003"}).
  const formulaDependenciesByField = useMemo(() => {
    const map = new Map();
    const fieldByNome = new Map(
      allColumns.map((column) => [column.field.toLowerCase(), column.field])
    );

    currentCollectionFormulas.forEach((formula) => {
      if (!formula?.formula) {
        return;
      }

      const formulaField = fieldByNome.get((formula.nome || "").toLowerCase());
      if (!formulaField) {
        return;
      }

      const tokens = formula.formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
      const deps = new Set();

      tokens.forEach((token) => {
        const field = fieldByNome.get(token.toLowerCase());
        if (field && field !== formulaField) {
          deps.add(field);
        }
      });

      if (deps.size > 0) {
        map.set(formulaField, deps);
      }
    });

    return map;
  }, [currentCollectionFormulas, allColumns]);

  const handleColumnsChange = (event) => {
    const value =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;

    // Ao selecionar um campo de fórmula, inclui automaticamente os campos
    // que compõem a expressão dela (com fixed-point, cobrindo fórmulas que
    // referenciam outras fórmulas).
    const expanded = new Set(value);
    let changed = true;
    while (changed) {
      changed = false;
      expanded.forEach((field) => {
        formulaDependenciesByField.get(field)?.forEach((dep) => {
          if (!expanded.has(dep)) {
            expanded.add(dep);
            changed = true;
          }
        });
      });
    }

    setSelectedColumns(Array.from(expanded));
    setPaginationModel((current) => ({
      ...current,
      page: 0,
    }));
  };

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

  const handleCdSetorInputChange = (event, newInputValue) => {
    setCdSetorInputValue(newInputValue);
  };

  const handleCdSetorChange = (event, newValue) => {
    setCdSetorFilter(newValue);
    setPaginationModel((current) => ({
      ...current,
      page: 0,
    }));
  };

  const handleSetorFilterChange = (event) => {
    const value = event.target.value;
    setSetorFilter(value);
    setSetorCdSetores(value === FILTER_SETOR ? IBGE_SETOR_FILTER : []);
    setPaginationModel((current) => ({
      ...current,
      page: 0,
    }));
  };

  const handleCdSetorKeyDown = (event) => {
    if (event.key === "Enter" && cdSetorInputValue.trim()) {
      event.preventDefault();
      const newValue = cdSetorInputValue.trim();
      if (!cdSetorFilter.includes(newValue)) {
        setCdSetorFilter((current) => [...current, newValue]);
      }
      setCdSetorInputValue("");
    }
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

  const openExportDialog = async () => {
    setErrorMessage("");
    setExporting(true);
    setTotalRecords(0);
    setExportDialogOpen(true);
    try {
      const countBody = {
        collection_name: selectedCollection,
        columns: selectedColumns,
        page: 1,
        limit: 1,
        ...(cdSetorFilter.length > 0
          ? { cd_setor: cdSetorFilter }
          : setorCdSetores.length > 0
          ? { cd_setor: setorCdSetores }
          : {}),
      };
      const countData = await postIbgeMongoList(countBody);
      setTotalRecords(
        Number.isFinite(Number(countData?.total_records))
          ? Number(countData.total_records)
          : 0
      );
    } catch (error) {
      setTotalRecords(0);
      setErrorMessage("Não foi possível obter o total de registros.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPage = async () => {
    setExporting(true);
    setErrorMessage("");
    try {
      const requestBody = {
        collection_name: selectedCollection,
        columns: selectedColumns,
        page: exportPage,
        limit: exportPageSize,
        ...(cdSetorFilter.length > 0
          ? { cd_setor: cdSetorFilter }
          : setorCdSetores.length > 0
          ? { cd_setor: setorCdSetores }
          : {}),
      };

      const data = await postIbgeMongoList(requestBody);
      const payloadRows = Array.isArray(data?.payload) ? data.payload : [];

      if (payloadRows.length === 0) {
        setErrorMessage(
          "Nenhum registro encontrado para a página selecionada."
        );
        return;
      }

      const visibleColumns = allColumns.filter((column) =>
        selectedColumns.includes(column.field)
      );
      const headers = visibleColumns
        .map((column) => column.headerName)
        .join(",");
      const csvRows = payloadRows.map((row) =>
        visibleColumns
          .map((column) => {
            const value = row[column.field];
            const strValue =
              value === null || value === undefined ? "" : String(value);
            return `"${strValue.replace(/"/g, '""')}"`;
          })
          .join(",")
      );
      const csv = [headers, ...csvRows].join("\n");
      const blob = new Blob([`\uFEFF${csv}`], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ibge_v2_${selectedCollection}_pagina_${exportPage}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportDialogOpen(false);
    } catch (error) {
      setErrorMessage("Não foi possível exportar os dados da página.");
    } finally {
      setExporting(false);
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
          ...(cdSetorFilter.length > 0
            ? { cd_setor: cdSetorFilter }
            : setorCdSetores.length > 0
            ? { cd_setor: setorCdSetores }
            : {}),
        };

        const data = await postIbgeMongoList(requestBody);

        if (!active) {
          return;
        }

        setRows(Array.isArray(data?.payload) ? data.payload : []);
        setTotalRecords(
          Number.isFinite(Number(data?.total_records))
            ? Number(data.total_records)
            : 0
        );
      } catch (error) {
        if (!active) {
          return;
        }

        setRows([]);
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
    setorCdSetores,
    formulas,
  ]);

  const rowCount = useMemo(() => {
    if (rows.length === 0 && paginationModel.page === 0) {
      return 0;
    }
    const hasMore = rows.length === paginationModel.pageSize;
    const currentMax = (paginationModel.page + 1) * paginationModel.pageSize;
    return currentMax + (hasMore ? 1 : 0);
  }, [rows, paginationModel.page, paginationModel.pageSize]);

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

        <Box sx={{ maxWidth: 140, width: "100%" }}>
          <FormControl fullWidth size="small">
            <InputLabel id="ibge-v2-setor-label">Setor</InputLabel>
            <Select
              labelId="ibge-v2-setor-label"
              id="ibge-v2-setor"
              value={setorFilter}
              onChange={handleSetorFilterChange}
              label="Setor"
            >
              <MenuItem value={FILTER_ALL}>Todos</MenuItem>
              <MenuItem value={FILTER_SETOR}>Maxacali</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ maxWidth: 360, width: "100%" }}>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={cdSetorFilter}
            inputValue={cdSetorInputValue}
            onInputChange={handleCdSetorInputChange}
            onChange={handleCdSetorChange}
            onKeyDown={handleCdSetorKeyDown}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip key={key} label={option} size="small" {...tagProps} />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="cd_setor"
                placeholder="Digite e pressione Enter"
                fullWidth
                size="small"
                sx={{
                  "& input:focus, & input:focus-visible": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }}
              />
            )}
          />
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            size="small"
            disableRipple
            onClick={openExportDialog}
            startIcon={<DownloadIcon />}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            size="small"
            disableRipple
            sx={{
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              boxShadow: "none",
              flexShrink: 0,
              minWidth: 0,
              px: 1.5,
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: "primary.main" },
              "&:focus": { backgroundColor: "primary.main" },
              "&:active": { backgroundColor: "primary.main" },
              "&:focus-visible": {
                backgroundColor: "primary.main",
                boxShadow: "none",
                outline: "none",
              },
              "&.Mui-focusVisible": {
                backgroundColor: "primary.main",
                boxShadow: "none",
              },
            }}
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
          loading={loading || formulasLoading}
          pagination
          paginationMode="server"
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          hideFooterRowCount
          hideFooterSelectedRowCount
          sx={{
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            "& .MuiTablePagination-toolbar .MuiTablePagination-displayedRows": {
              display: "none",
            },
            "& .MuiTablePagination-spacer": {
              display: "none",
            },
          }}
        />
      </Box>

      <Dialog
        open={formulaDialogOpen}
        onClose={() => setFormulaDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Fórmulas</DialogTitle>
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

      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Exportar dados IBGE V2</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2">
              Total de registros considerando o filtro atual:{" "}
              <b>{totalRecords}</b>
            </Typography>

            {totalRecords > EXPORT_PAGE_SIZE_OPTIONS[0] && (
              <Alert severity="warning">
                Não é possível baixar todos os {totalRecords} registros de uma
                vez devido ao tamanho dos dados. Recomendamos a exportação por
                páginas de {EXPORT_PAGE_SIZE_OPTIONS[0].toLocaleString("pt-BR")}{" "}
                registros.
              </Alert>
            )}

            <Typography variant="subtitle2">Registros por vez</Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="ibge-v2-export-size-label">
                Registros por vez
              </InputLabel>
              <Select
                labelId="ibge-v2-export-size-label"
                id="ibge-v2-export-size"
                value={exportPageSize}
                onChange={(event) => {
                  setExportPage(1);
                  setExportPageSize(Number(event.target.value));
                }}
                label="Registros por vez"
              >
                {EXPORT_PAGE_SIZE_OPTIONS.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size.toLocaleString("pt-BR")} registros
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle2">
              Exportar por página ({exportPageSize.toLocaleString("pt-BR")}{" "}
              registros por página)
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Página"
                type="number"
                size="small"
                value={exportPage}
                onChange={(event) =>
                  setExportPage(
                    Math.max(
                      1,
                      Math.min(
                        Number(event.target.value) || 1,
                        exportTotalPages
                      )
                    )
                  )
                }
                inputProps={{ min: 1, max: exportTotalPages }}
                sx={{ width: 120 }}
              />
              <Typography variant="body2" color="text.secondary">
                de {exportTotalPages} página{exportTotalPages === 1 ? "" : "s"}
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleExportPage}
            disabled={exporting}
            startIcon={
              exporting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DownloadIcon />
              )
            }
          >
            {exporting ? "Baixando..." : "Baixar página"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default DataTableIbgeV2Component;
