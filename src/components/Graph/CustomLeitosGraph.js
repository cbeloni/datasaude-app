import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Box } from "@mui/material";
import { chartSeriesColors, chartSx } from "theme/chartPalette";

const data = [
  { value: 13, label: "Leitos Dia", color: chartSeriesColors.accent },
  { value: 108, label: "Leitos", color: chartSeriesColors.primary },
  { value: 55, label: "Leitos UTI", color: chartSeriesColors.warning },
];

export default function CustomLeitosGraph() {
  return (
    <Box sx={{ width: "100%" }}>
      <PieChart
        height={350}
        series={[
          {
            arcLabel: (item) => `${item.label} (${item.value})`,
            arcLabelMinAngle: 45,
            innerRadius: 50,
            paddingAngle: 2,
            cornerRadius: 4,
            data,
          },
        ]}
        sx={{
          ...chartSx,
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "#fff",
            fontWeight: 600,
            fontSize: 12,
          },
        }}
      />
    </Box>
  );
}
