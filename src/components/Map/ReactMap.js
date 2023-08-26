import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";
import { Box, Select, Slider } from "@material-ui/core";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import { useMap } from "react-leaflet";

const ReactMaps = () => {
  var { map } = useMap();
  // const map = useMap(L.map("mapa").setView([-23.6226, -46.5489], 9));
  const IMG_DEFAULT =
    "http://datasaude-app.beloni.dev.br/maps/data/1_Krig_media_mp10_2_1.png";

  const [currentMap, setCurrentMap] = useState(
    "http://datasaude-app.beloni.dev.br/maps/data/1_Krig_media_mp10_2_1.png"
  );

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

  const handleChange = (e) => {
    console.log("map:", map);
    setCurrentMap(e.target.value);
  };

  const createLayer = (img_layer, bounds_group) => {
    var img_1_Krig_media_mp10_2_1 = img_layer;
    var img_bounds_1_Krig_media_mp10_2_1 = [
      [-24.075632306045406, -47.21016939502355],
      [-23.174450701460348, -45.693560989597614],
    ];
    var layer_1_Krig_media_mp10_2_1 = new L.imageOverlay(
      img_1_Krig_media_mp10_2_1,
      img_bounds_1_Krig_media_mp10_2_1,
      { pane: "pane_1_Krig_media_mp10_2_1" }
    );
    bounds_group.addLayer(layer_1_Krig_media_mp10_2_1);
    map.addLayer(layer_1_Krig_media_mp10_2_1);
    return layer_1_Krig_media_mp10_2_1;
  };

  useEffect(() => {
    var bounds_group = new L.featureGroup([]);
    map = L.map("mapa").setView([-23.6226, -46.5489], 9);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
    }).addTo(map);

    L.marker([-23.40563825, -46.30159285])
      .addTo(map)
      .bindPopup(
        "ESTRADA DOS INDIOS DE 1 A 99999 2645 CHACARAS COPACO 7439060"
      );
    L.marker([-23.5225, -46.63918998])
      .addTo(map)
      .bindPopup("RUA ADORACAO 67 BOM RETIRO 1128080");
    L.marker([-23.53437107, -46.72766621])
      .addTo(map)
      .bindPopup(
        "AVENIDA IMPERATRIZ LEOPOLDINA DE 1585 A 99999 1845 VILA LEOPOLDINA 5305007"
      );

    map.createPane("pane_1_Krig_media_mp10_2_1");
    map.getPane("pane_1_Krig_media_mp10_2_1").style.zIndex = 401;
    var layer_1_Krig_media_mp10_2_1 = createLayer(IMG_DEFAULT, bounds_group);

    var baseMaps = {};
    L.control
      .layers(baseMaps, { "1_Krig_media_mp10_2": layer_1_Krig_media_mp10_2_1 })
      .addTo(map);
  }, []);

  const configLayer = () => {
    map.eachLayer(function (layer) {
      if (layer.options.pane == "pane_1_Krig_media_mp10_2_1") {
        console.log("layer krig");
        map.removeLayer(layer);
      } else {
        console.log("outra layer layer");
      }
    });
  };

  useEffect(() => {
    console.log("Mapa selecionado:", currentMap);
    console.log("map:", map);
    // const currentMapa = myMap.current.leafletElement;
    if (typeof map?.eachLayer === "function" && currentMap != IMG_DEFAULT) {
      console.log("Verificando layer");
      configLayer();
    }
  }, [currentMap]);

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
          <div id="mapa" style={{ height: "80vh" }}></div>
        </GridItem>
      </GridContainer>
    </>
  );
};

export default ReactMaps;
