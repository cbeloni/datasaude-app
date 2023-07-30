import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";
import { Box, Slider } from "@material-ui/core";

const Maps = () => {
  useEffect(() => {
    const map = L.map("map").setView([-23.6226, -46.5489], 9);

    // const iconMarker = L.icon({
    //   iconUrl: '/images/marker-icon.png',
    //   iconSize: [25, 41],
    //   iconAnchor: [12, 41],
    //   popupAnchor: [0, -41],
    // });

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

  const marks = [
    {
      value: 0,
      label: "Jan",
    },
    {
      value: 10,
      label: "Fev",
    },
    {
      value: 20,
      label: "Mar",
    },
    {
      value: 30,
      label: "Abr",
    },
    {
      value: 40,
      label: "Mai",
    },
    {
      value: 50,
      label: "Jun",
    },
    {
      value: 60,
      label: "Jul",
    },
    {
      value: 100,
      label: "Dez",
    },
  ];

  function valuetext(value) {
    return `${value}`;
  }

  return (
    <>
      <Box sx={{ width: 300, paddingLeft: "30px" }}>
        <Slider
          aria-label="Custom marks"
          defaultValue={20}
          getAriaValueText={valuetext}
          step={10}
          valueLabelDisplay="auto"
          marks={marks}
        />
      </Box>
      <div id="map" style={{ height: "80vh" }}></div>
    </>
  );
};

export default Maps;
