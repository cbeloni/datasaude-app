import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const data = [
  { value: 13, label: "Leitos Dia" },
  { value: 108, label: "Leitos" },
  { value: 55, label: "Leitos UTI" },
];

const size = {
  height: 350,
};

export default function CustomLeitosGraph() {
  return (
    <div style={{ width: "100%" }}>
      <PieChart
        series={[
          {
            arcLabel: (item) => `${item.label} (${item.value})`,
            arcLabelMinAngle: 45,
            data,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "bold",
          },
        }}
        {...size}
      />
    </div>
  );
}
