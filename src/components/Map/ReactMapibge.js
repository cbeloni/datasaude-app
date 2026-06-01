import React, { useEffect, useMemo, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import {
  GeoJSON,
  LayersControl,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const { BaseLayer, Overlay } = LayersControl;

import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { listIbgeFormulas, postIbgeList } from "services/IbgeService";
import { ibgeCaracteristicaColumns } from "components/Table/ibgeHelper";
import { buildJenksBreaks, DEFAULT_JENKS_CLASSES } from "utils/map/jenks";
import PropTypes from "prop-types";

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
      Ajustar para IBGE
    </button>
  );
}

ResetViewButton.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
};

const normalizeFieldName = (name) =>
  name.trim().toLowerCase().replace(/\s+/g, "_");

const defaultSelectableFields = [
  "v0001",
  "v0002",
  "v0003",
  "v0004",
  "v0005",
  "v0006",
  "v0007",
  "v00047",
  "percentual_domicios_ocupados",
  "percentual_pessoas",
];

const BLUE_SCALE = ["#deebf7", "#9ecae1", "#6baed6", "#3182bd", "#08519c"];

const getColorByBreaks = (value, breaks) => {
  if (!Number.isFinite(value) || !Array.isArray(breaks) || breaks.length < 2) {
    return "#9e9e9e";
  }

  for (let i = 1; i < breaks.length; i += 1) {
    if (value <= breaks[i]) {
      return BLUE_SCALE[Math.min(i - 1, BLUE_SCALE.length - 1)];
    }
  }

  return BLUE_SCALE[BLUE_SCALE.length - 1];
};

function ScaleLegend({ breaks, selectedField }) {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.style.background = "white";
      div.style.padding = "12px 14px";
      div.style.borderRadius = "6px";
      div.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
      div.style.fontSize = "14px";
      div.style.minWidth = "220px";
      div.style.marginRight = "28px";
      div.style.marginBottom = "26px";

      const classes = [];
      for (let i = 1; i < breaks.length; i += 1) {
        classes.push({
          color: BLUE_SCALE[Math.min(i - 1, BLUE_SCALE.length - 1)],
          min: breaks[i - 1],
          max: breaks[i],
        });
      }

      const classesHtml = classes
        .map(
          (item) =>
            `<div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
              <span style="width:14px; height:14px; display:inline-block; border-radius:2px; background:${
                item.color
              }; border:1px solid #cfd8dc;"></span>
              <span>${item.min.toFixed(2)} - ${item.max.toFixed(2)}</span>
            </div>`
        )
        .join("");

      div.innerHTML = `
        <div><strong>${selectedField || "Campo"}</strong></div>
        ${classesHtml || '<div style="margin-top:6px;">Sem dados</div>'}
        <div style="margin-top:6px; color:#555;">5 classes (Jenks Natural Breaks)</div>
      `;

      return div;
    };

    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map, breaks, selectedField]);

  return null;
}

ScaleLegend.propTypes = {
  breaks: PropTypes.arrayOf(PropTypes.number),
  selectedField: PropTypes.string,
};

ScaleLegend.defaultProps = {
  breaks: [],
  selectedField: "",
};

function ReactMapIbge() {
  const initialPosition = [-16.886, -40.545];
  const initialZoom = window.innerWidth >= 768 ? 13 : 12;

  const [geoData, setGeoData] = useState(null);
  const [loadingGeo, setLoadingGeo] = useState(true);
  const [ibgeRows, setIbgeRows] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [selectedField, setSelectedField] = useState(
    "percentual_domicios_ocupados"
  );

  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const response = await fetch("/setores.geojson");
        if (!response.ok) {
          throw new Error("Falha ao carregar GeoJSON");
        }
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        setGeoData(null);
      } finally {
        setLoadingGeo(false);
      }
    };

    loadGeoJson();
  }, []);

  useEffect(() => {
    let active = true;

    const loadIbgeData = async () => {
      try {
        const [ibgeResponse, formulaResponse] = await Promise.all([
          postIbgeList({
            take: 1000,
            prev: null,
            skip: 0,
            columns: [],
          }),
          listIbgeFormulas(),
        ]);

        if (!active) {
          return;
        }

        setIbgeRows(ibgeResponse?.payload || []);
        setFormulas(formulaResponse?.payload || []);
      } catch (error) {
        if (!active) {
          return;
        }
        setIbgeRows([]);
        setFormulas([]);
      }
    };

    loadIbgeData();

    return () => {
      active = false;
    };
  }, []);

  const formulaFields = useMemo(
    () =>
      formulas.map((formula) => ({
        value: normalizeFieldName(formula.nome),
        label: formula.nome,
      })),
    [formulas]
  );

  const selectableFields = useMemo(() => {
    const tableFields = ibgeCaracteristicaColumns.map((col) => ({
      value: col.field,
      label: col.headerName,
    }));

    const baseFields = [
      {
        value: "percentual_domicios_ocupados",
        label: "Percentual Domicílios Ocupados",
      },
      { value: "percentual_pessoas", label: "Percentual Pessoas" },
    ];

    const merged = [...baseFields, ...tableFields, ...formulaFields];
    const dedup = [];
    const seen = new Set();

    merged.forEach((item) => {
      if (
        !seen.has(item.value) &&
        defaultSelectableFields.includes(item.value)
      ) {
        seen.add(item.value);
        dedup.push(item);
      }
    });

    formulaFields.forEach((item) => {
      if (!seen.has(item.value)) {
        seen.add(item.value);
        dedup.push(item);
      }
    });

    return dedup;
  }, [formulaFields]);

  useEffect(() => {
    if (!selectableFields.find((item) => item.value === selectedField)) {
      const fallback =
        selectableFields[0]?.value || "percentual_domicios_ocupados";
      setSelectedField(fallback);
    }
  }, [selectableFields, selectedField]);

  const valuesBySetor = useMemo(() => {
    const map = new Map();
    ibgeRows.forEach((row) => {
      const rawSetor = row.cd_setor;
      const setor =
        rawSetor === null || rawSetor === undefined ? "" : String(rawSetor);
      const value = Number(row[selectedField]);
      if (setor && Number.isFinite(value)) {
        map.set(setor, value);
      }
    });
    return map;
  }, [ibgeRows, selectedField]);

  const jenksBreaks = useMemo(() => {
    const numericValues = Array.from(valuesBySetor.values()).filter((value) =>
      Number.isFinite(value)
    );
    return buildJenksBreaks(numericValues, DEFAULT_JENKS_CLASSES);
  }, [valuesBySetor]);

  const getSetorStyle = (feature) => {
    const setor = String(feature?.properties?.CD_SETOR || "");
    const value = valuesBySetor.get(setor);
    return {
      fillColor: getColorByBreaks(value, jenksBreaks),
      weight: 1.2,
      opacity: 1,
      color: "white",
      dashArray: "2",
      fillOpacity: 0.7,
    };
  };

  const onEachSetor = (feature, layer) => {
    const p = feature.properties;
    const setor = String(p.CD_SETOR || "");
    const value = valuesBySetor.get(setor);
    const valorFormatado = Number.isFinite(value) ? value.toFixed(2) : "—";
    const nomeCampo =
      selectableFields.find((item) => item.value === selectedField)?.label ||
      selectedField;

    const nome = p.NM_AGLOM || p.NM_DIST || p.NM_MUN || "Setor";
    layer.bindPopup(
      `<b>${nome}</b><br/>
      <b>Código do Setor:</b> ${p.CD_SETOR}<br/>
      <b>${nomeCampo}:</b> ${valorFormatado}<br/>
      <b>Município:</b> ${p.NM_MUN || "—"}<br/>
      <b>Distrito:</b> ${p.NM_DIST || "—"}<br/>
      <b>Situação:</b> ${p.SITUACAO || "—"}`
    );
  };

  const selectedFieldLabel =
    selectableFields.find((field) => field.value === selectedField)?.label ||
    selectedField;

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Stack spacing={2} sx={{ mb: 1.5 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 360, maxWidth: 460 }}>
              <InputLabel id="ibge-field-label">Campo do mapa IBGE</InputLabel>
              <Select
                labelId="ibge-field-label"
                value={selectedField}
                label="Campo do mapa IBGE"
                onChange={(event) => setSelectedField(event.target.value)}
              >
                {selectableFields.map((field) => (
                  <MenuItem key={field.value} value={field.value}>
                    {field.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>

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

            {!loadingGeo &&
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

          <ScaleLegend
            breaks={jenksBreaks}
            selectedField={selectedFieldLabel}
          />
        </MapContainer>
      </GridItem>
    </GridContainer>
  );
}

export default ReactMapIbge;
