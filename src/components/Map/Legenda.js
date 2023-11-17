import { useEffect } from "react";
import L from "leaflet";
import "./Legenda.css";
import PropTypes from "prop-types";

function Legenda({ map }) {
  console.log(map);
  useEffect(() => {
    if (map) {
      const legend = L.control({ position: "bottomright" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML = "<h4>Legenda</h4>";
        return div;
      };

      legend.addTo(map);
    }
  }, [map]);
  return null;
}

export default Legenda;

Legenda.propTypes = {
  map: PropTypes.any,
};
