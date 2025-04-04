import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import PropTypes from "prop-types";

export default function CustomLineGraph({ xLabels, previsao, historico }) {
  if (
    xLabels.length != previsao.length ||
    previsao.length != historico.length
  ) {
    return null;
  }
  return (
    <div style={{ width: "100%" }}>
      <LineChart
        height="500"
        series={[
          {
            data: historico,
            label: "Histórico",
            lineStyle: { stroke: "blue" },
          },
          { data: previsao, label: "Previsão", lineStyle: { stroke: "red" } },
        ]}
        xAxis={[{ scaleType: "time", data: xLabels }]}
      />
    </div>
  );
}

CustomLineGraph.propTypes = {
  xLabels: PropTypes.array.isRequired,
  previsao: PropTypes.array.isRequired,
  historico: PropTypes.array.isRequired,
};
