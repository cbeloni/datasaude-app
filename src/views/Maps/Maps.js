import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";
import { Box, Slider } from "@material-ui/core";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";

const Maps = () => {
  useEffect(() => {
    const map = L.map("map").setView([-23.6226, -46.5489], 9);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
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
  }, []);

  function valuetext(value) {
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
  }

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
          <div id="map" style={{ height: "80vh" }}></div>
        </GridItem>
      </GridContainer>
    </>
  );
};

export default Maps;
