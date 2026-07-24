import React, { useEffect, useMemo, useRef, useState } from "react";
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

import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { formatColumnLabel } from "components/Table/ibgeV2Helper";
import { listIbgeFormulas, postIbgeMongoList } from "services/IbgeV2Service";
import { buildJenksBreaks, DEFAULT_JENKS_CLASSES } from "utils/map/jenks";
import PropTypes from "prop-types";

const { BaseLayer, Overlay } = LayersControl;

const DEFAULT_COLLECTION_MANIFEST_PATH = "/ibge-v2/index.json";
const BLUE_SCALE = ["#deebf7", "#9ecae1", "#6baed6", "#3182bd", "#08519c"];

function ResetViewButton({ center, zoom }) {
  const map = useMap();

  return (
    <button
      onClick={() => map.setView(center, zoom)}
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

const getColorByBreaks = (value, breaks) => {
  if (!Number.isFinite(value) || !Array.isArray(breaks) || breaks.length < 2) {
    return "#9e9e9e";
  }

  for (let index = 1; index < breaks.length; index += 1) {
    if (value <= breaks[index]) {
      return BLUE_SCALE[Math.min(index - 1, BLUE_SCALE.length - 1)];
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
      for (let index = 1; index < breaks.length; index += 1) {
        classes.push({
          color: BLUE_SCALE[Math.min(index - 1, BLUE_SCALE.length - 1)],
          min: breaks[index - 1],
          max: breaks[index],
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
        ${
          classesHtml ||
          '<div style="margin-top:6px;">Sem dados numéricos</div>'
        }
        <div style="margin-top:6px; color:#555;">5 classes (Jenks Natural Breaks)</div>
      `;

      return div;
    };

    legend.addTo(map);
    return () => legend.remove();
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

function MapMessage({ message }) {
  const map = useMap();

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const control = L.control({ position: "topright" });
    control.onAdd = () => {
      const div = L.DomUtil.create("div", "info map-message");
      div.style.background = "white";
      div.style.padding = "12px 14px";
      div.style.borderRadius = "6px";
      div.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
      div.style.fontSize = "14px";
      div.style.maxWidth = "320px";
      div.style.color = "#5f2120";
      div.textContent = message;
      return div;
    };

    control.addTo(map);
    return () => control.remove();
  }, [map, message]);

  return null;
}

MapMessage.propTypes = {
  message: PropTypes.string,
};

MapMessage.defaultProps = {
  message: "",
};

const getDefaultField = (fields) =>
  fields.find((field) => field === "area_km2") ||
  fields.find((field) => /^v\d/.test(field)) ||
  fields[0] ||
  "";

function ReactMapIbgeV2() {
  const initialPosition = [-16.886, -40.545];
  const initialZoom = window.innerWidth >= 768 ? 13 : 12;
  const selectedFieldRef = useRef("");
  const selectedCollectionRef = useRef("");
  const valuesBySetorRef = useRef(new Map());
  const [geoData, setGeoData] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collectionFields, setCollectionFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [ibgeRows, setIbgeRows] = useState([]);
  const [numericFieldsByCollection, setNumericFieldsByCollection] = useState(
    {}
  );
  const [schemaStatus, setSchemaStatus] = useState("loading");
  const [formulas, setFormulas] = useState([]);
  const [mapMessage, setMapMessage] = useState("");

  const selectedCollectionFile = useMemo(
    () =>
      collections.find((collection) => collection.value === selectedCollection),
    [collections, selectedCollection]
  );

  useEffect(() => {
    let active = true;

    const loadMapConfiguration = async () => {
      try {
        const [
          geoResult,
          collectionsResult,
          schemaResult,
          formulasResult,
        ] = await Promise.allSettled([
          fetch("/setores.geojson"),
          fetch(DEFAULT_COLLECTION_MANIFEST_PATH),
          fetch("/ibge-v2/schema.json"),
          listIbgeFormulas(),
        ]);
        if (!active) {
          return;
        }

        let hasConfigurationError = false;
        if (geoResult.status === "fulfilled" && geoResult.value.ok) {
          setGeoData(await geoResult.value.json());
        } else {
          hasConfigurationError = true;
        }

        let normalizedCollections = [];
        if (
          collectionsResult.status === "fulfilled" &&
          collectionsResult.value.ok
        ) {
          const manifest = await collectionsResult.value.json();
          normalizedCollections = Array.isArray(manifest) ? manifest : [];
          setCollections(normalizedCollections);
        } else {
          hasConfigurationError = true;
          setCollections([]);
        }

        if (schemaResult.status === "fulfilled" && schemaResult.value.ok) {
          const schema = await schemaResult.value.json();
          setNumericFieldsByCollection(schema?.collections || {});
          setSchemaStatus("ready");
        } else {
          setNumericFieldsByCollection({});
          setSchemaStatus("error");
          setMapMessage(
            "Não foi possível carregar o schema numérico do Mapa IBGE V2."
          );
        }

        if (formulasResult.status === "fulfilled") {
          const formulaResponse = formulasResult.value;
          const formulaList =
            formulaResponse?.payload && Array.isArray(formulaResponse.payload)
              ? formulaResponse.payload
              : [];
          setFormulas(formulaList);
        } else {
          setFormulas([]);
        }

        setCollections(normalizedCollections);
        setSelectedCollection(normalizedCollections[0]?.value || "");
        if (hasConfigurationError && schemaResult.status === "fulfilled") {
          setMapMessage(
            "Não foi possível carregar a configuração do Mapa IBGE V2."
          );
        }
      } catch (error) {
        if (active) {
          setGeoData(null);
          setCollections([]);
          setSchemaStatus("error");
          setMapMessage(
            "Não foi possível carregar a configuração do Mapa IBGE V2."
          );
        }
      }
    };

    loadMapConfiguration();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    selectedFieldRef.current = selectedField;
  }, [selectedField]);

  useEffect(() => {
    selectedCollectionRef.current = selectedCollection;
  }, [selectedCollection]);

  useEffect(() => {
    let active = true;

    const loadCollectionFields = async () => {
      if (!selectedCollectionFile?.file) {
        setCollectionFields([]);
        setSelectedField("");
        return;
      }

      try {
        const response = await fetch(selectedCollectionFile.file);
        if (!response.ok) {
          throw new Error("Falha ao carregar campos da collection");
        }

        const fields = await response.json();
        if (!active) {
          return;
        }

        const numericFields =
          numericFieldsByCollection[selectedCollection] || [];
        const formulaFields = formulas
          .filter(
            (f) =>
              !f.collection_name || f.collection_name === selectedCollection
          )
          .map((f) => f.nome.trim().toLowerCase().replace(/\s+/g, "_"));
        const baseFields = (Array.isArray(fields)
          ? fields
          : []
        ).filter((field) => numericFields.includes(field));
        const selectableFields = [
          ...baseFields,
          ...formulaFields.filter((f) => !baseFields.includes(f)),
        ];
        setCollectionFields(selectableFields);
        setSelectedField(getDefaultField(selectableFields));
        setMapMessage(
          schemaStatus === "error"
            ? "Não foi possível carregar os campos numéricos do schema."
            : selectableFields.length === 0
            ? "A collection selecionada não possui campos numéricos suportados pelo mapa."
            : ""
        );
      } catch (error) {
        if (active) {
          setCollectionFields([]);
          setSelectedField("");
          setMapMessage(
            "Não foi possível carregar os campos da collection selecionada."
          );
        }
      }
    };

    loadCollectionFields();

    return () => {
      active = false;
    };
  }, [
    numericFieldsByCollection,
    schemaStatus,
    selectedCollection,
    selectedCollectionFile,
    formulas,
  ]);

  const geoSetores = useMemo(
    () =>
      (geoData?.features || [])
        .map((feature) => String(feature?.properties?.CD_SETOR || ""))
        .filter(Boolean),
    [geoData]
  );

  useEffect(() => {
    let active = true;

    const loadIbgeData = async () => {
      if (
        !selectedCollection ||
        collectionFields.length === 0 ||
        geoSetores.length === 0
      ) {
        setIbgeRows([]);
        return;
      }

      try {
        const allColumns = ["cd_setor", ...collectionFields];
        const response = await postIbgeMongoList({
          collection_name: selectedCollection,
          columns: allColumns,
          cd_setor: geoSetores,
          page: 1,
          limit: geoSetores.length,
        });
        if (active) {
          const rows = Array.isArray(response?.payload) ? response.payload : [];
          setIbgeRows(rows);
          const hasNumericValue = rows.some((row) => {
            if (row[selectedField] === null || row[selectedField] === "") {
              return false;
            }
            return Number.isFinite(Number(row[selectedField]));
          });
          setMapMessage(
            hasNumericValue
              ? ""
              : "O mapa não suporta apresentar o campo selecionado porque não há valores numéricos disponíveis."
          );
        }
      } catch (error) {
        if (active) {
          setIbgeRows([]);
          setMapMessage(
            "Não foi possível carregar os dados numéricos da collection selecionada."
          );
        }
      }
    };

    loadIbgeData();

    return () => {
      active = false;
    };
  }, [selectedCollection, collectionFields, geoSetores]);

  const valuesBySetor = useMemo(() => {
    const values = new Map();
    ibgeRows.forEach((row) => {
      const setor = String(row.cd_setor || "");
      const rawValue = row[selectedField];
      const value =
        rawValue === null || rawValue === "" ? NaN : Number(rawValue);
      if (setor && Number.isFinite(value)) {
        values.set(setor, value);
      }
    });
    valuesBySetorRef.current = values;
    return values;
  }, [ibgeRows, selectedField]);

  const jenksBreaks = useMemo(() => {
    try {
      return buildJenksBreaks(
        Array.from(valuesBySetor.values()).filter(Number.isFinite),
        DEFAULT_JENKS_CLASSES
      );
    } catch (error) {
      return [];
    }
  }, [valuesBySetor]);

  const getSetorStyle = (feature) => {
    const setor = String(feature?.properties?.CD_SETOR || "");
    return {
      fillColor: getColorByBreaks(valuesBySetor.get(setor), jenksBreaks),
      weight: 1.2,
      opacity: 1,
      color: "white",
      dashArray: "2",
      fillOpacity: 0.7,
    };
  };

  const onEachSetor = (feature, layer) => {
    const properties = feature.properties;
    const name =
      properties.NM_AGLOM || properties.NM_DIST || properties.NM_MUN || "Setor";

    const fieldRef = selectedFieldRef;
    const collectionRef = selectedCollectionRef;

    layer.bindPopup(() => {
      const setor = String(properties.CD_SETOR || "");
      const value = valuesBySetorRef.current.get(setor);
      const formattedValue = Number.isFinite(value) ? value.toFixed(2) : "—";
      return `<b>${name}</b><br/>
        <b>Código do Setor:</b> ${properties.CD_SETOR}<br/>
        <b>Collection:</b> ${collectionRef.current || "—"}<br/>
        <b>${
          formatColumnLabel(fieldRef.current) || "Campo"
        }:</b> ${formattedValue}<br/>
        <b>Município:</b> ${properties.NM_MUN || "—"}<br/>
        <b>Distrito:</b> ${properties.NM_DIST || "—"}<br/>
        <b>Situação:</b> ${properties.SITUACAO || "—"}`;
    });
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Stack spacing={2} sx={{ mb: 1.5 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 300, maxWidth: 460 }}>
              <InputLabel id="ibge-v2-collection-label">Collection</InputLabel>
              <Select
                labelId="ibge-v2-collection-label"
                value={selectedCollection}
                label="Collection"
                onChange={(event) => setSelectedCollection(event.target.value)}
              >
                {collections.map((collection) => (
                  <MenuItem key={collection.value} value={collection.value}>
                    {collection.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              disabled={collectionFields.length === 0}
              size="small"
              sx={{ minWidth: 360, maxWidth: 560 }}
            >
              <InputLabel id="ibge-v2-field-label">
                Campo do mapa IBGE V2
              </InputLabel>
              <Select
                labelId="ibge-v2-field-label"
                value={selectedField}
                label="Campo do mapa IBGE V2"
                onChange={(event) => setSelectedField(event.target.value)}
              >
                {collectionFields.map((field) => (
                  <MenuItem key={field} value={field}>
                    {formatColumnLabel(field)}
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

            {(geoData?.features || []).map((feature) => {
              const properties = feature.properties;
              const name =
                properties.NM_AGLOM ||
                properties.NM_DIST ||
                `Setor ${properties.CD_SETOR}`;

              return (
                <Overlay checked name={name} key={properties.CD_SETOR}>
                  <GeoJSON
                    data={{ type: "FeatureCollection", features: [feature] }}
                    style={() => getSetorStyle(feature)}
                    onEachFeature={onEachSetor}
                  />
                </Overlay>
              );
            })}
          </LayersControl>

          <ScaleLegend
            breaks={jenksBreaks}
            selectedField={formatColumnLabel(selectedField)}
          />
          <MapMessage message={mapMessage} />
        </MapContainer>
      </GridItem>
    </GridContainer>
  );
}

export default ReactMapIbgeV2;
