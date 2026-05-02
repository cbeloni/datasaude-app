import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ImageOverlay,
  LayersControl,
  LayerGroup,
} from "react-leaflet";

const { Overlay, BaseLayer } = LayersControl;

import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ChevronLeft";
import ArrowForwardIos from "@mui/icons-material/ChevronRight";
import { IMG_DEFAULT, IMG_BASE } from "./ConstantsMap";
import { estacoes } from "./ConstantsEstacoes";
import DateRange from "components/DataPicker/DateRange";
import dayjs from "dayjs";
import obtemPacientes from "../../services/ApiService";
import formatarPacienteMapa from "utils/formatter";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import PropTypes from "prop-types";

function ResetMapViewButton({ center, zoom }) {
  const map = useMap();

  return (
    <Button
      onClick={() => map.setView(center, zoom)}
      variant="contained"
      color="primary"
      size="small"
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 1000,
        borderRadius: 20,
        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.28)",
      }}
    >
      Recentrar mapa
    </Button>
  );
}

ResetMapViewButton.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
};

function ReactMap2() {
  const initialPosition = [-23.6226, -46.5489];
  const initialZoom = window.innerWidth >= 768 ? 10 : 9;

  const [currentMap, setCurrentMap] = useState(IMG_DEFAULT);
  const imageBounds = [
    [-24.075632306045406, -47.21016939502355],
    [-23.174450701460348, -45.693560989597614],
  ];

  const [dadosPacientes, setDadosPacientes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs("2022-01-30"));
  const [selectedEscala, setSelectedEscala] = useState("movel");
  const [selectedPoluenteValue, setSelectedPoluenteValue] = React.useState(
    "MP10"
  );
  const CID_ALL = "TODOS";

  const [selectedCidValues, setSelectedCidValues] = React.useState([CID_ALL]);
  const [cidSelectOpen, setCidSelectOpen] = React.useState(false);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const requestData = {
          dt_atendimento: selectedDate.format("YYYY-MM-DD"),
          poluente: selectedPoluenteValue,
        };
        if (
          selectedCidValues.length > 0 &&
          !selectedCidValues.includes(CID_ALL)
        ) {
          requestData.ds_cid = selectedCidValues.join(", ");
        }
        const dadosPacientes = await obtemPacientes(requestData);

        const dadosPacientesFormatado = dadosPacientes.map(
          formatarPacienteMapa
        );
        console.log("pacientes: ", dadosPacientesFormatado);
        setDadosPacientes(dadosPacientesFormatado);
      } catch (error) {
        console.log("Erro ao obter pacietnes:", error);
      }
    };

    fetchDataFromApi();
  }, [selectedDate, selectedPoluenteValue, selectedCidValues]);

  useEffect(() => {
    atualizaMapa();
  }, [selectedDate, selectedEscala, selectedPoluenteValue]);

  const atualizaMapa = () => {
    const currentDate = selectedDate.format("YYYYMMDD");
    setCurrentMap(
      IMG_BASE +
        "png_" +
        selectedEscala +
        "/" +
        selectedPoluenteValue +
        "_" +
        currentDate +
        ".png"
    );
  };

  const handleRadioChange = (event) => {
    setSelectedEscala(event.target.value);
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const dataAnterior = () => {
    setSelectedDate(selectedDate.subtract(1, "day"));
  };

  const dataPosterior = () => {
    setSelectedDate(selectedDate.add(1, "day"));
  };

  const handlePoluenteChange = (event) => {
    setSelectedPoluenteValue(event.target.value);
  };

  const handleCidChange = (event) => {
    const value = event.target.value;
    const nextValues = typeof value === "string" ? value.split(", ") : value;

    if (nextValues.includes(CID_ALL)) {
      if (nextValues.length > 1) {
        const filteredValues = nextValues.filter((v) => v !== CID_ALL);
        setSelectedCidValues(filteredValues);
        setCidSelectOpen(false);
        return;
      }
      setSelectedCidValues([CID_ALL]);
      setCidSelectOpen(false);
      return;
    }

    if (nextValues.length === 0) {
      setSelectedCidValues([CID_ALL]);
      setCidSelectOpen(false);
      return;
    }

    setSelectedCidValues(nextValues);
    setCidSelectOpen(false);
  };

  const CID_COLORS = {
    "BRONQUIOLITE AGUDA": "#1976d2",
    "INFECCAO AGUDA DAS VIAS AEREAS SUPERIORES NAO ESPECIFICADA": "#e65100",
  };

  const getMarkerIcon = (ds_cid) => {
    const color = CID_COLORS[ds_cid] || "#757575";
    const markup = renderToStaticMarkup(
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
        </svg>
      </div>
    );
    return divIcon({ className: "", html: markup, iconSize: [32, 32] });
  };

  return (
    <Stack spacing={2}>
      <Card variant="outlined" sx={{ p: 2.5 }}>
        <Stack spacing={0.25} sx={{ mb: 2 }}>
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontSize: "0.6875rem",
              letterSpacing: "0.14em",
              fontWeight: 600,
            }}
          >
            Filtros de visualização
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Ajuste data, escala, poluente e CID para atualizar mapa e pacientes.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "auto minmax(180px, 1fr) auto auto auto auto",
            },
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={dataAnterior}
            size="small"
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1.5,
              width: 40,
              height: 40,
              color: "text.secondary",
              "&:hover": { borderColor: "primary.main", color: "primary.main" },
            }}
            aria-label="dia anterior"
          >
            <ArrowBackIos />
          </IconButton>

          <DateRange
            value={selectedDate}
            onChange={handleDateChange}
            label="Data"
          />

          <IconButton
            onClick={dataPosterior}
            size="small"
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1.5,
              width: 40,
              height: 40,
              color: "text.secondary",
              "&:hover": { borderColor: "primary.main", color: "primary.main" },
            }}
            aria-label="próximo dia"
          >
            <ArrowForwardIos />
          </IconButton>

          <ToggleButtonGroup
            value={selectedEscala}
            exclusive
            onChange={(_, v) =>
              v && handleRadioChange({ target: { value: v } })
            }
            size="small"
            sx={{
              height: 40,
              "& .MuiToggleButton-root": {
                px: 2,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.8125rem",
                color: "text.secondary",
                "&.Mui-selected": {
                  backgroundColor: "primary.50",
                  color: "primary.dark",
                  "&:hover": { backgroundColor: "primary.100" },
                },
              },
            }}
          >
            <ToggleButton value="movel">Móvel</ToggleButton>
            <ToggleButton value="fixa">Fixa</ToggleButton>
          </ToggleButtonGroup>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="select-label">Poluente</InputLabel>
            <Select
              labelId="select-label"
              id="select"
              value={selectedPoluenteValue}
              label="Poluente"
              onChange={handlePoluenteChange}
              MenuProps={{ PaperProps: { sx: { maxHeight: 320, mt: 0.5 } } }}
            >
              <MenuItem value="MP10">MP10</MenuItem>
              <MenuItem value="NO">NO</MenuItem>
              <MenuItem value="NO2">NO2</MenuItem>
              <MenuItem value="O3">O3</MenuItem>
              <MenuItem value="TEMP">TEMP</MenuItem>
              <MenuItem value="UR">UR</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="cid-label">CID</InputLabel>
            <Select
              labelId="cid-label"
              id="select-cid"
              multiple
              open={cidSelectOpen}
              onOpen={() => setCidSelectOpen(true)}
              onClose={() => setCidSelectOpen(false)}
              value={selectedCidValues}
              onChange={handleCidChange}
              label="CID"
              MenuProps={{ PaperProps: { sx: { maxHeight: 360, mt: 0.5 } } }}
              renderValue={(selected) =>
                selected.length === 0 || selected.includes(CID_ALL)
                  ? "Todos"
                  : selected
                      .map((v) =>
                        v === "BRONQUIOLITE AGUDA"
                          ? "Bronquiolite"
                          : "Infecção VAS"
                      )
                      .join(", ")
              }
              displayEmpty
            >
              <MenuItem value={CID_ALL}>Todos</MenuItem>
              <MenuItem value="BRONQUIOLITE AGUDA">Bronquiolite Aguda</MenuItem>
              <MenuItem value="INFECCAO AGUDA DAS VIAS AEREAS SUPERIORES NAO ESPECIFICADA">
                Infecção Aguda Vias Aéreas
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      <Card variant="outlined" sx={{ overflow: "hidden", borderRadius: 2 }}>
        <Box>
          <MapContainer
            center={initialPosition}
            zoom={initialZoom}
            style={{ height: "74vh", width: "100%" }}
          >
            <LayersControl position="topright">
              <BaseLayer checked name="Google Maps Street">
                <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}" />
              </BaseLayer>
              <BaseLayer name="Google Maps Satélite">
                <TileLayer url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}" />
              </BaseLayer>
              <BaseLayer name="Open Street Map">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </BaseLayer>
              <Overlay checked name="Interpolação">
                <ImageOverlay url={currentMap} bounds={imageBounds} />
              </Overlay>
              <Overlay checked name="Estações">
                <LayerGroup>
                  {estacoes.map((estacao) => (
                    <Marker
                      position={estacao.localidade}
                      key={estacao.localidade}
                    >
                      <Popup>{estacao.endereco} </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </Overlay>
              <Overlay checked name="Pacientes">
                <LayerGroup>
                  {dadosPacientes.map((paciente) => (
                    <Marker
                      position={paciente.localidade}
                      key={paciente.objeto.id}
                      icon={getMarkerIcon(paciente.objeto.ds_cid)}
                    >
                      <Popup>
                        Código Atendimento: {paciente.objeto.cd_atendimento}
                        <br />
                        Nome: {paciente.objeto.nm_paciente} <br />
                        Data Atendimento: {paciente.objeto.data} <br />
                        Poluente: {paciente.objeto.poluente} <br />
                        Índice interpolado: {paciente.objeto.indice} <br />
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </Overlay>
            </LayersControl>

            <ResetMapViewButton center={initialPosition} zoom={initialZoom} />
          </MapContainer>
        </Box>
      </Card>
    </Stack>
  );
}

export default ReactMap2;
