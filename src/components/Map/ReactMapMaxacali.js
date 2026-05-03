import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  LayersControl,
  GeoJSON,
} from "react-leaflet";

const { Overlay, BaseLayer } = LayersControl;

import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { IMG_BASE } from "./ConstantsMap";
import dayjs from "dayjs";
import obtemPacientes from "../../services/ApiService";
import formatarPacienteMapa from "utils/formatter";
import PropTypes from "prop-types";

// ─── Componente auxiliar ───
function ResetViewButton({ center, zoom }) {
  const map = useMap();

  const handleClick = () => {
    map.setView(center, zoom);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        top: "100px",
        left: "10px",
        zIndex: 1000,
      }}
    >
      Ajustar para Maxacali
    </button>
  );
}

ResetViewButton.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
};

const SETOR_COLORS = [
  "#e53935",
  "#8e24aa",
  "#1e88e5",
  "#00897b",
  "#f4511e",
  "#6d4c41",
];

function ReactMapMaxacali() {
  const initialPosition = [-16.886, -40.545];
  const initialZoom = window.innerWidth >= 768 ? 12 : 11;

  const [selectedDate] = useState(dayjs("2022-01-30"));
  const [selectedEscala] = useState("movel");
  const [selectedPoluenteValue] = useState("MP10");
  const [selectedCidValues] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Carrega o GeoJSON via fetch ───
  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const response = await fetch("/setores.geojson");
        if (!response.ok) throw new Error("Falha ao carregar GeoJSON");
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error("Erro ao carregar GeoJSON:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGeoJson();
  }, []);

  // ─── Carrega dados de pacientes com cleanup ───
  useEffect(() => {
    let isMounted = true;

    const fetchDataFromApi = async () => {
      try {
        const requestData = {
          dt_atendimento: selectedDate.format("YYYY-MM-DD"),
          poluente: selectedPoluenteValue,
        };
        if (selectedCidValues.length > 0) {
          requestData.ds_cid = selectedCidValues.join(", ");
        }

        const dadosPacientes = await obtemPacientes(requestData);

        if (isMounted) {
          dadosPacientes.map(formatarPacienteMapa);
        }
      } catch (error) {
        console.log("Erro ao obter pacientes:", error);
      }
    };

    fetchDataFromApi();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedPoluenteValue, selectedCidValues]);

  useEffect(() => {
    atualizaMapa();
  }, [selectedDate, selectedEscala, selectedPoluenteValue]);

  const atualizaMapa = () => {
    const currentDate = selectedDate.format("YYYYMMDD");
    IMG_BASE +
      "png_" +
      selectedEscala +
      "/" +
      selectedPoluenteValue +
      "_" +
      currentDate +
      ".png";
  };

  // ─── Mapa de cores por setor (calculado uma vez que geoData carrega) ───
  const setorColorMap = React.useMemo(() => {
    if (!geoData) return {};
    const map = {};
    geoData.features.forEach((feature, index) => {
      map[feature.properties.CD_SETOR] =
        SETOR_COLORS[index % SETOR_COLORS.length];
    });
    return map;
  }, [geoData]);

  const getSetorStyle = (feature) => ({
    fillColor: setorColorMap[feature.properties.CD_SETOR] || "#999",
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.45,
  });

  const onEachSetor = (feature, layer) => {
    const p = feature.properties;
    const nome = p.NM_AGLOM || p.NM_DIST || p.NM_MUN || "Setor";
    layer.bindPopup(
      `<b>${nome}</b><br/>
      <b>Código do Setor:</b> ${p.CD_SETOR}<br/>
      <b>Município:</b> ${p.NM_MUN}<br/>
      <b>Distrito:</b> ${p.NM_DIST || "—"}<br/>
      <b>Situação:</b> ${p.SITUACAO}<br/>
      <b>Área (km²):</b> ${Number(p.AREA_KM2).toFixed(4)}`
    );
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <MapContainer
          center={initialPosition}
          zoom={initialZoom}
          style={{ height: "80vh", width: "100%" }}
        >
          <ResetViewButton center={initialPosition} zoom={initialZoom} />

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

            {!loading &&
              geoData &&
              geoData.features.map((feature) => {
                const p = feature.properties;
                const nome = p.NM_AGLOM || p.NM_DIST || `Setor ${p.CD_SETOR}`;
                const singleFeatureCollection = {
                  type: "FeatureCollection",
                  features: [feature],
                };
                return (
                  <Overlay checked name={nome} key={p.CD_SETOR}>
                    <GeoJSON
                      data={singleFeatureCollection}
                      style={() => getSetorStyle(feature)}
                      onEachFeature={onEachSetor}
                    />
                  </Overlay>
                );
              })}
          </LayersControl>
        </MapContainer>
      </GridItem>
    </GridContainer>
  );
}

export default ReactMapMaxacali;
