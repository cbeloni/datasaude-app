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
import { Box, Button } from "@material-ui/core";
import { IMG_DEFAULT } from "./ConstantsMap";
import { estacoes } from "./ConstantsEstacoes";
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

function ReactMapBronquiolite() {
  const initialPosition = [-23.6226, -46.5489];
  const initialZoom = window.innerWidth >= 768 ? 10 : 9;

  const [dadosPacientes, setDadosPacientes] = useState([]);
  const imageBounds = [
    [-24.075632306045406, -47.21016939502355],
    [-23.174450701460348, -45.693560989597614],
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchDataFromStaticJson = async () => {
      try {
        const response = await fetch("/paciente_internacao_bronquiolite.json");
        if (!response.ok) {
          throw new Error("Falha ao carregar JSON fixo de bronquiolite");
        }

        const pacientes = await response.json();
        if (isMounted) {
          setDadosPacientes(pacientes.map(formatarPacienteMapa));
        }
      } catch (error) {
        console.log("Erro ao obter pacientes do JSON fixo:", error);
      }
    };

    fetchDataFromStaticJson();

    return () => {
      isMounted = false;
    };
  }, []);

  const getMarkerIcon = () => {
    const markup = renderToStaticMarkup(
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#2f6db3",
          opacity: 0.85,
          border: "1px solid #ffffff",
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.2)",
        }}
      />
    );
    return divIcon({ className: "", html: markup });
  };

  return (
    <GridContainer>
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
                <ImageOverlay url={IMG_DEFAULT} bounds={imageBounds} />
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
                      icon={getMarkerIcon()}
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

export default ReactMapBronquiolite;
