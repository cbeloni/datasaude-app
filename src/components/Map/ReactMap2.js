import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ImageOverlay,
  LayersControl,
} from "react-leaflet";

const { Overlay } = LayersControl;

import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { Box, Select, Slider } from "@material-ui/core";

function ReactMap2() {
  // Defina as coordenadas iniciais do marcador
  const initialPosition = [-23.6226, -46.5489];

  const IMG_DEFAULT =
    "http://datasaude-app.beloni.dev.br/maps/data/1_Krig_media_mp10_2_1.png";
  const [currentMap, setCurrentMap] = useState(
    "http://datasaude-app.beloni.dev.br/maps/data/1_Krig_media_mp10_2_1.png"
  );
  const imageBounds = [
    [-24.075632306045406, -47.21016939502355],
    [-23.174450701460348, -45.693560989597614],
  ];

  // Defina uma função de ajuste de zoom que você deseja usar
  const setZoomAndCenter = (zoomLevel, center) => {
    const map = useMap();
    map.setView(center, zoomLevel);
  };

  const marks = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Fev" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Abr" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Ago" },
    { value: 9, label: "Set" },
    { value: 10, label: "Out" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dez" },
  ];

  const handleChange = (e) => {
    // console.log("map:", map);
    console.log("e:", e.target.value);
    setCurrentMap(e.target.value);
  };

  const selectMapa = [
    {
      value: "http://datasaude-app.beloni.dev.br/maps/data/2022_mp10_2_1.png",
      label: "2022",
    },
    {
      value: IMG_DEFAULT,
      label: "2023",
    },
  ];

  const valuetext = (value) => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[value - 1];
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={1}>
          <Box sx={{ paddingLeft: "30px", paddingRight: "30px" }}>
            <Select onChange={handleChange} defaultValue={selectMapa[1].value}>
              {selectMapa.map((mapa) => (
                <option key={mapa.value} value={mapa.value}>
                  {mapa.label}
                </option>
              ))}
            </Select>
          </Box>
        </GridItem>
        <GridItem xs={12} sm={4}>
          <Box sx={{ paddingLeft: "30px", paddingRight: "30px" }}>
            <Slider
              aria-label="Custom marks"
              defaultValue={2}
              getAriaValueText={valuetext}
              step={1}
              valueLabelDisplay="auto"
              marks={marks}
              min={1}
              max={12}
            />
          </Box>
        </GridItem>
        <GridItem xs={12}>
          <MapContainer
            center={initialPosition}
            zoom={9}
            style={{ height: "80vh", width: "100%" }}
          >
            <LayersControl position="topright">
              <Overlay checked name="OpenStreetMap">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </Overlay>
              <Overlay checked name="Interpolação">
                <ImageOverlay url={currentMap} bounds={imageBounds} />
              </Overlay>
              <Overlay checked name="Marcadores">
                <Marker position={initialPosition}>
                  <Popup>Um marcador personalizado</Popup>
                </Marker>
              </Overlay>
            </LayersControl>
            <button
              onClick={() => setZoomAndCenter(9, [-23.6226, -46.5489])}
              style={{ position: "absolute", top: "10px", left: "10px" }}
            >
              Ajustar Zoom e Centralização
            </button>
          </MapContainer>
        </GridItem>
      </GridContainer>
    </>
  );
}

export default ReactMap2;
