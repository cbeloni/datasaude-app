import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { chartSeriesColors, chartSx } from "theme/chartPalette";

export default function CustomLineGraph({ xLabels, previsao, historico }) {
  if (
    xLabels.length !== previsao.length ||
    previsao.length !== historico.length
  ) {
    return null;
  }
  return (
    <Box sx={{ width: "100%" }}>
      <LineChart
        height={420}
        sx={chartSx}
        series={[
          {
            data: historico,
            label: "Histórico",
            color: chartSeriesColors.primary,
            curve: "monotoneX",
          },
          {
            data: previsao,
            label: "Previsão",
            color: chartSeriesColors.warning,
            curve: "monotoneX",
          },
        ]}
        xAxis={[{ scaleType: "time", data: xLabels }]}
      />
    </Box>
  );
}

CustomLineGraph.propTypes = {
  xLabels: PropTypes.array.isRequired,
  previsao: PropTypes.array.isRequired,
  historico: PropTypes.array.isRequired,
};
