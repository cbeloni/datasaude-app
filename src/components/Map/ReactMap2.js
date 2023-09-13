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
import { valueMonths, marks, selectMapa } from "./HelperMap";

const { Overlay, BaseLayer } = LayersControl;

import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { Box, Slider, Select, MenuItem, makeStyles } from "@material-ui/core";
import { IMG_DEFAULT } from "./ConstantsMap";
import styles from "./stylesMap";

const useStyles = makeStyles(styles);

function ReactMap2() {
  const classes = useStyles();
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

  const handleChange = (e) => {
    // console.log("map:", map);
    console.log("e:", e.target.value);
    setCurrentMap(e.target.value);
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={2}>
          <Box sx={{ paddingLeft: "30px", paddingRight: "30px" }}>
            <Select
              onChange={handleChange}
              defaultValue={selectMapa[1].value}
              className={classes.selectStyle}
            >
              {selectMapa.map((mapa) => (
                <MenuItem
                  key={mapa.value}
                  value={mapa.value}
                  className={classes.selectStyle}
                >
                  {mapa.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </GridItem>
        <GridItem xs={12} sm={4}>
          <Box sx={{ paddingLeft: "30px", paddingRight: "30px" }}>
            <Slider
              aria-label="Custom marks"
              defaultValue={2}
              getAriaValueText={valueMonths}
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
              <Overlay checked name="Marcadores">
                <Marker position={initialPosition}>
                  <Popup>Um marcador personalizado</Popup>
                </Marker>
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
    </>
  );
}

export default ReactMap2;
