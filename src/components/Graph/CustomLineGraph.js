import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { xLabels, previsao, historico } from "./CustomLineGraphValues";

export default function CustomLineGraph() {
  return (
    <LineChart
      width={1300}
      height={500}
      series={[
        { data: historico, label: "Histórico", lineStyle: { stroke: "blue" } },
        { data: previsao, label: "Previsão", lineStyle: { stroke: "red" } },
      ]}
      xAxis={[{ scaleType: "time", data: xLabels }]}
    />
  );
}
