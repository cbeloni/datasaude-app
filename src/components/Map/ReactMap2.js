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
import { Box, Button, Checkbox, ListItemText } from "@material-ui/core";
import { IMG_DEFAULT, IMG_BASE } from "./ConstantsMap";
import { estacoes } from "./ConstantsEstacoes";
import DateRange from "components/DataPicker/DateRange";
import RowRadioButtonsGroup from "components/RadioGroup/RadioGroupHorizontal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import dayjs from "dayjs";
import { OutlinedInput } from "@mui/material";
import obtemPacientes from "../../services/ApiService";

function ReactMap2() {
  // Defina as coordenadas iniciais do marcador
  const initialPosition = [-23.6226, -46.5489];
  const initialZoom = window.innerWidth >= 768 ? 10 : 9;

  const [currentMap, setCurrentMap] = useState(IMG_DEFAULT);
  const imageBounds = [
    [-24.075632306045406, -47.21016939502355],
    [-23.174450701460348, -45.693560989597614],
  ];

  // Defina uma função de ajuste de zoom que você deseja usar
  const setZoomAndCenter = (zoomLevel, center) => {
    const map = useMap();
    map.setView(center, zoomLevel);
  };

  const [selectedDate, setSelectedDate] = useState(dayjs("2022-01-30"));
  const [selectedEscala, setSelectedEscala] = useState("movel");
  const [selectedPoluenteValue, setSelectedPoluenteValue] = React.useState(
    "MP10"
  );
  const [nomesPordata, setNomesPorData] = useState([]);
  const [setErro] = useState(null);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const nomesDosPacientes = await obtemPacientes({
          dt_atendimento: selectedDate.format("YYYY-MM-DD"),
        });

        console.log("nomes dos pacientes", nomesDosPacientes);
        setNomesPorData(nomesDosPacientes);
      } catch (error) {
        setErro(error.message);
      }
    };

    fetchDataFromApi();
  }, [selectedDate]);

  useEffect(() => {
    atualizaMapa();
  }, [selectedDate]);

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

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [pacienteNome, setPacienteNome] = React.useState([]);

  const handleChangePaciente = (event) => {
    const {
      target: { value },
    } = event;
    setPacienteNome(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={1}>
        <Box p={2}>
          <Button
            variant="text"
            color="primary"
            startIcon={<ArrowBackIos />}
            onClick={dataAnterior}
          >
            Anterior
          </Button>
        </Box>
      </GridItem>
      <GridItem xs={12} sm={2}>
        <Box p={2}>
          <DateRange
            value={selectedDate}
            onChange={handleDateChange}
          ></DateRange>
        </Box>
      </GridItem>
      <GridItem xs={12} sm={1}>
        <Box p={2}>
          <Button
            variant="text"
            color="primary"
            startIcon={<ArrowForwardIos />}
            onClick={dataPosterior}
          >
            Próximo
          </Button>
        </Box>
      </GridItem>
      <GridItem xs={12} sm={1}></GridItem>
      <GridItem xs={12} sm={2}>
        <Box p={2}>
          <RowRadioButtonsGroup
            value={selectedEscala}
            onChange={handleRadioChange}
          ></RowRadioButtonsGroup>
        </Box>
      </GridItem>
      <GridItem xs={12} sm={2}>
        <Box p={1}>
          <InputLabel id="select-label">Poluente:</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            value={selectedPoluenteValue}
            onChange={handlePoluenteChange}
          >
            <MenuItem value="MP10">MP10</MenuItem>
            <MenuItem value="NO">NO</MenuItem>
            <MenuItem value="NO2">NO2</MenuItem>
            <MenuItem value="O3">O3</MenuItem>
            <MenuItem value="TEMP">TEMP</MenuItem>
            <MenuItem value="UR">UR</MenuItem>
          </Select>
        </Box>
      </GridItem>
      <GridItem xs={12} sm={3}>
        <Box p={1}>
          <InputLabel id="select-label">Paciente:</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={pacienteNome}
            onChange={handleChangePaciente}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {nomesPordata.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={pacienteNome.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </Box>
      </GridItem>
      <GridItem xs={12}>
        <MapContainer
          center={initialPosition}
          zoom={initialZoom}
          style={{ height: "80vh", width: "100%" }}
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
                    <Popup>{estacao.endereco}</Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </Overlay>
          </LayersControl>
          <button
            onClick={() => setZoomAndCenter(8, [-23.6226, -46.5489])}
            style={{ position: "absolute", top: "10px", left: "10px" }}
          >
            Ajustar Zoom e Centralização
          </button>
        </MapContainer>
      </GridItem>
    </GridContainer>
  );
}

export default ReactMap2;
