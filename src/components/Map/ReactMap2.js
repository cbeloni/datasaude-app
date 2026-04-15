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
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { Box, Button, Typography } from "@material-ui/core";
import { IMG_DEFAULT, IMG_BASE } from "./ConstantsMap";
import { estacoes } from "./ConstantsEstacoes";
import DateRange from "components/DataPicker/DateRange";
import RowRadioButtonsGroup from "components/RadioGroup/RadioGroupHorizontal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import dayjs from "dayjs";
import obtemPacientes from "../../services/ApiService";
import formatarPacienteMapa from "utils/formatter";
import Fab from "@material-ui/core/Fab";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import Accessibility from "@material-ui/icons/Accessibility";
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
  const CID_OPTIONS = [
    "BRONQUIOLITE AGUDA",
    "INFECCAO AGUDA DAS VIAS AEREAS SUPERIORES NAO ESPECIFICADA",
  ];

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

    if (nextValues.length === CID_OPTIONS.length) {
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
      <Fab
        size="small"
        variant="extended"
        style={{ backgroundColor: color, color: "#fff" }}
      >
        <Accessibility />
      </Fab>
    );
    return divIcon({ className: "", html: markup });
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Box
          p={2}
          style={{
            background: "linear-gradient(135deg, #f7fbff 0%, #eef4f9 100%)",
            border: "1px solid #dbe5ef",
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Typography
            variant="h6"
            style={{ fontWeight: 700, color: "#1a365d", marginBottom: 6 }}
          >
            Filtros de visualização
          </Typography>
          <Typography variant="body2" style={{ color: "#4f5d75" }}>
            Ajuste data, escala, poluente e CID para atualizar mapa e dados de
            pacientes.
          </Typography>

          <GridContainer>
            <GridItem xs={12} md={4}>
              <Box
                mt={2}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "nowrap",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIos />}
                  onClick={dataAnterior}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Anterior
                </Button>

                <Box style={{ flex: 1, minWidth: 0 }}>
                  <DateRange
                    value={selectedDate}
                    onChange={handleDateChange}
                  ></DateRange>
                </Box>

                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<ArrowForwardIos />}
                  onClick={dataPosterior}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Próximo
                </Button>
              </Box>
            </GridItem>

            <GridItem xs={12} md={3}>
              <Box mt={2}>
                <RowRadioButtonsGroup
                  value={selectedEscala}
                  onChange={handleRadioChange}
                ></RowRadioButtonsGroup>
              </Box>
            </GridItem>

            <GridItem xs={12} md={2}>
              <Box mt={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="select-label">Poluente</InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    value={selectedPoluenteValue}
                    label="Poluente"
                    onChange={handlePoluenteChange}
                  >
                    <MenuItem value="MP10">MP10</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                    <MenuItem value="NO2">NO2</MenuItem>
                    <MenuItem value="O3">O3</MenuItem>
                    <MenuItem value="TEMP">TEMP</MenuItem>
                    <MenuItem value="UR">UR</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </GridItem>

            <GridItem xs={12} md={3}>
              <Box mt={2}>
                <FormControl fullWidth size="small">
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
                    renderValue={(selected) =>
                      selected.length === 0 || selected.includes(CID_ALL)
                        ? "Todos"
                        : selected
                            .map((v) =>
                              v === "BRONQUIOLITE AGUDA"
                                ? "Bronquiolite Aguda"
                                : "Infecção Vias Aéreas"
                            )
                            .join(", ")
                    }
                    displayEmpty
                  >
                    <MenuItem value={CID_ALL}>Todos</MenuItem>
                    <MenuItem value="BRONQUIOLITE AGUDA">
                      Bronquiolite Aguda
                    </MenuItem>
                    <MenuItem value="INFECCAO AGUDA DAS VIAS AEREAS SUPERIORES NAO ESPECIFICADA">
                      Infec&ccedil;&atilde;o Aguda Vias A&eacute;reas Superiores
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </GridItem>
          </GridContainer>
        </Box>
      </GridItem>

      <GridItem xs={12}>
        <Box
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #dbe5ef",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
          }}
        >
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
      </GridItem>
    </GridContainer>
  );
}

export default ReactMap2;
