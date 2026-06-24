import React, { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  LayerGroup,
  LayersControl,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

import "leaflet/dist/leaflet.css";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

const { BaseLayer, Overlay } = LayersControl;

const TODOS = "TODOS";
const SIM = "SIM";
const NAO = "NAO";

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
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
};

const getSimNao = (value) => (value ? SIM : NAO);

const normalizePaciente = (paciente, index) => {
  const latitude = Number(paciente.latitude);
  const longitude = Number(paciente.longitude);
  const diasUti = Number(paciente.dias_uti);
  const vsrPositivo =
    paciente.indicador_vsr_positivo === 1 ||
    paciente.indicador_vsr_positivo === "1" ||
    paciente.indicador_vsr_positivo === true;

  return {
    ...paciente,
    id: `${index}-${latitude}-${longitude}`,
    anoAtendimento: String(paciente.ano_atendimento),
    diasUti: Number.isFinite(diasUti) ? diasUti : 0,
    necessitaUti: Number.isFinite(diasUti) && diasUti > 0,
    vsrPositivo,
    localidade: [latitude, longitude],
    coordenadasValidas: Number.isFinite(latitude) && Number.isFinite(longitude),
  };
};

function ReactMapBronquioliteVsr() {
  const initialPosition = [-23.5505, -46.6333];
  const initialZoom = window.innerWidth >= 768 ? 10 : 9;

  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAno, setSelectedAno] = useState(TODOS);
  const [selectedUti, setSelectedUti] = useState(TODOS);
  const [selectedVsr, setSelectedVsr] = useState(TODOS);

  useEffect(() => {
    let active = true;

    const loadPacientes = async () => {
      try {
        const response = await fetch("/bronquiolite_vsr_202606232216.json");
        if (!response.ok) {
          throw new Error("Falha ao carregar o JSON de bronquiolite VSR");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Formato inválido do JSON de bronquiolite VSR");
        }

        if (active) {
          setPacientes(
            data
              .map(normalizePaciente)
              .filter((paciente) => paciente.coordenadasValidas)
          );
        }
      } catch (loadError) {
        if (active) {
          setError("Não foi possível carregar os dados do mapa.");
          setPacientes([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPacientes();

    return () => {
      active = false;
    };
  }, []);

  const anos = useMemo(
    () =>
      Array.from(
        new Set(pacientes.map((paciente) => paciente.anoAtendimento))
      ).sort((anoA, anoB) => Number(anoA) - Number(anoB)),
    [pacientes]
  );

  const pacientesFiltrados = useMemo(
    () =>
      pacientes.filter((paciente) => {
        const anoAtivo =
          selectedAno === TODOS || paciente.anoAtendimento === selectedAno;
        const utiAtiva =
          selectedUti === TODOS ||
          getSimNao(paciente.necessitaUti) === selectedUti;
        const vsrAtivo =
          selectedVsr === TODOS ||
          getSimNao(paciente.vsrPositivo) === selectedVsr;

        return anoAtivo && utiAtiva && vsrAtivo;
      }),
    [pacientes, selectedAno, selectedUti, selectedVsr]
  );

  const getMarkerColor = (paciente) => {
    if (paciente.vsrPositivo && paciente.necessitaUti) {
      return "#c62828";
    }

    if (paciente.vsrPositivo) {
      return "#ef6c00";
    }

    if (paciente.necessitaUti) {
      return "#6a1b9a";
    }

    return "#1976d2";
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
            Filtre os atendimentos por ano, necessidade de UTI e resultado de
            VSR. Exibindo {pacientesFiltrados.length} de {pacientes.length}{" "}
            registros.
          </Typography>

          <GridContainer>
            <GridItem xs={12} md={4}>
              <Box mt={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="ano-atendimento-label">
                    Ano de atendimento
                  </InputLabel>
                  <Select
                    labelId="ano-atendimento-label"
                    id="select-ano-atendimento"
                    value={selectedAno}
                    onChange={(event) => setSelectedAno(event.target.value)}
                    label="Ano de atendimento"
                  >
                    <MenuItem value={TODOS}>Todos</MenuItem>
                    {anos.map((ano) => (
                      <MenuItem key={ano} value={ano}>
                        {ano}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </GridItem>

            <GridItem xs={12} md={4}>
              <Box mt={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="necessita-uti-label">
                    Necessita UTI
                  </InputLabel>
                  <Select
                    labelId="necessita-uti-label"
                    id="select-necessita-uti"
                    value={selectedUti}
                    onChange={(event) => setSelectedUti(event.target.value)}
                    label="Necessita UTI"
                  >
                    <MenuItem value={TODOS}>Todos</MenuItem>
                    <MenuItem value={SIM}>Sim</MenuItem>
                    <MenuItem value={NAO}>Não</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </GridItem>

            <GridItem xs={12} md={4}>
              <Box mt={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="vsr-positivo-label">VSR positivo</InputLabel>
                  <Select
                    labelId="vsr-positivo-label"
                    id="select-vsr-positivo"
                    value={selectedVsr}
                    onChange={(event) => setSelectedVsr(event.target.value)}
                    label="VSR positivo"
                  >
                    <MenuItem value={TODOS}>Todos</MenuItem>
                    <MenuItem value={SIM}>Sim</MenuItem>
                    <MenuItem value={NAO}>Não</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </GridItem>
          </GridContainer>

          {loading && (
            <Typography variant="body2" style={{ marginTop: 12 }}>
              Carregando dados...
            </Typography>
          )}
          {error && (
            <Typography variant="body2" color="error" style={{ marginTop: 12 }}>
              {error}
            </Typography>
          )}
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
              <BaseLayer checked name="Open Street Map">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </BaseLayer>
              <BaseLayer name="Google Maps Street">
                <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}" />
              </BaseLayer>
              <BaseLayer name="Google Maps Satélite">
                <TileLayer url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}" />
              </BaseLayer>
              <Overlay checked name="Atendimentos">
                <LayerGroup>
                  {pacientesFiltrados.map((paciente) => (
                    <CircleMarker
                      key={paciente.id}
                      center={paciente.localidade}
                      radius={5}
                      pathOptions={{
                        color: "#ffffff",
                        fillColor: getMarkerColor(paciente),
                        fillOpacity: 0.82,
                        opacity: 0.9,
                        weight: 1,
                      }}
                    >
                      <Popup>
                        Ano do atendimento: {paciente.anoAtendimento}
                        <br />
                        Data do atendimento: {paciente.data_atendimento || "—"}
                        <br />
                        Necessita UTI: {paciente.necessitaUti ? "Sim" : "Não"}
                        <br />
                        Dias de UTI: {paciente.diasUti}
                        <br />
                        VSR positivo: {paciente.vsrPositivo ? "Sim" : "Não"}
                      </Popup>
                    </CircleMarker>
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

export default ReactMapBronquioliteVsr;
