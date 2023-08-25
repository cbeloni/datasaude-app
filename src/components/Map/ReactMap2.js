import React from "react";
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

function ReactMap2() {
  // Defina as coordenadas iniciais do marcador
  const initialPosition = [-23.6226, -46.5489];

  const imageUrl =
    "http://datasaude-app.beloni.dev.br/maps/data/1_Krig_media_mp10_2_1.png";
  const imageBounds = [
    [-24.075632306045406, -47.21016939502355],
    [-23.174450701460348, -45.693560989597614],
  ];

  // Defina uma função de ajuste de zoom que você deseja usar
  const setZoomAndCenter = (zoomLevel, center) => {
    const map = useMap();
    map.setView(center, zoomLevel);
  };

  return (
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
          <ImageOverlay url={imageUrl} bounds={imageBounds} />
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
  );
}

export default ReactMap2;
