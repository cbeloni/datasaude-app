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
import { IMG_DEFAULT } from "./ConstantsMap";
import { estacoes } from "./ConstantsEstacoes";
import formatarPacienteMapa from "utils/formatter";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import PropTypes from "prop-types";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

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

  const [todosPacientes, setTodosPacientes] = useState([]);
  const [dadosPacientes, setDadosPacientes] = useState([]);
  const [selectedCid, setSelectedCid] = useState("TODOS");
  const [selectedInternacao, setSelectedInternacao] = useState("TODOS");
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
        const pacientesFormatados = pacientes.map(formatarPacienteMapa);
        if (isMounted) {
          setTodosPacientes(pacientesFormatados);
          setDadosPacientes(pacientesFormatados);
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

  useEffect(() => {
    const pacientesFiltrados = todosPacientes.filter((paciente) => {
      const filtroCidAtivo =
        selectedCid === "TODOS" || paciente.objeto.ds_cid === selectedCid;
      const filtroInternacaoAtivo =
        selectedInternacao === "TODOS" ||
        paciente.objeto.internacao === selectedInternacao;
      return filtroCidAtivo && filtroInternacaoAtivo;
    });

    setDadosPacientes(pacientesFiltrados);
  }, [todosPacientes, selectedCid, selectedInternacao]);

  const cidOptions = Array.from(
    new Set(todosPacientes.map((paciente) => paciente.objeto.ds_cid))
  );
  const internacaoOptions = Array.from(
    new Set(todosPacientes.map((paciente) => paciente.objeto.internacao))
  );

  const CID_COLORS = {
    "BRONQUIOLITE AGUDA": "#1976d2",
    "INFECCAO AGUDA DAS VIAS AEREAS SUPERIORES NAO ESPECIFICADA": "#e65100",
  };

  const getMarkerIcon = (dsCid) => {
    const markerColor = CID_COLORS[dsCid] || "#2f6db3";
    const markup = renderToStaticMarkup(
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: markerColor,
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
            Filtre os pacientes por CID e por status de internação.
          </Typography>

          <GridContainer>
            <GridItem xs={12} md={6}>
              <Box mt={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="cid-label">CID</InputLabel>
                  <Select
                    labelId="cid-label"
                    id="select-cid"
                    value={selectedCid}
                    onChange={(event) => setSelectedCid(event.target.value)}
                    label="CID"
                  >
                    <MenuItem value="TODOS">Todos</MenuItem>
                    {cidOptions.map((cid) => (
                      <MenuItem key={cid} value={cid}>
                        {cid}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </GridItem>

            <GridItem xs={12} md={6}>
              <Box mt={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="internacao-label">Internação</InputLabel>
                  <Select
                    labelId="internacao-label"
                    id="select-internacao"
                    value={selectedInternacao}
                    onChange={(event) =>
                      setSelectedInternacao(event.target.value)
                    }
                    label="Internação"
                  >
                    <MenuItem value="TODOS">Todos</MenuItem>
                    {internacaoOptions.map((internacao) => (
                      <MenuItem key={internacao} value={internacao}>
                        {internacao}
                      </MenuItem>
                    ))}
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
                      icon={getMarkerIcon(paciente.objeto.ds_cid)}
                    >
                      <Popup>
                        Código Atendimento: {paciente.objeto.cd_atendimento}
                        <br />
                        Nome: {paciente.objeto.nm_paciente} <br />
                        Data Atendimento: {paciente.objeto.dt_atendimento}{" "}
                        <br />
                        CID: {paciente.objeto.ds_cid} <br />
                        Internação: {paciente.objeto.internacao} <br />
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
