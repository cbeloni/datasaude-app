import * as React from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

function TickParamsSelector({
  // eslint-disable-next-line react/prop-types
  tickPlacement,
  // eslint-disable-next-line react/prop-types
  tickLabelPlacement,
  // eslint-disable-next-line react/prop-types
  setTickPlacement,
  // eslint-disable-next-line react/prop-types
  setTickLabelPlacement,
}) {
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <FormControl>
        <FormLabel id="tick-placement-radio-buttons-group-label">
          tickPlacement
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="tick-placement-radio-buttons-group-label"
          name="tick-placement"
          value={tickPlacement}
          onChange={(event) => setTickPlacement(event.target.value)}
        >
          <FormControlLabel value="start" control={<Radio />} label="start" />
          <FormControlLabel value="end" control={<Radio />} label="end" />
          <FormControlLabel value="middle" control={<Radio />} label="middle" />
          <FormControlLabel
            value="extremities"
            control={<Radio />}
            label="extremities"
          />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel id="label-placement-radio-buttons-group-label">
          tickLabelPlacement
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="label-placement-radio-buttons-group-label"
          name="label-placement"
          value={tickLabelPlacement}
          onChange={(event) => setTickLabelPlacement(event.target.value)}
        >
          <FormControlLabel value="tick" control={<Radio />} label="tick" />
          <FormControlLabel value="middle" control={<Radio />} label="middle" />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}

const dataset = [
  {
    qtd: 109,
    DT_ATENDIMENTO: "2022-06-24",
  },
  {
    qtd: 99,
    DT_ATENDIMENTO: "2022-06-25",
  },
  {
    qtd: 114,
    DT_ATENDIMENTO: "2022-06-26",
  },
  {
    qtd: 146,
    DT_ATENDIMENTO: "2022-06-27",
  },
  {
    qtd: 117,
    DT_ATENDIMENTO: "2022-06-28",
  },
  {
    qtd: 115,
    DT_ATENDIMENTO: "2022-06-29",
  },
  {
    qtd: 132,
    DT_ATENDIMENTO: "2022-06-30",
  },
  {
    qtd: 117,
    DT_ATENDIMENTO: "2022-07-01",
  },
];

const valueFormatter = (value) => `${value} pacientes`;

const chartSetting = {
  yAxis: [
    {
      label: "Qtd atendimentos",
    },
  ],
  series: [{ dataKey: "qtd", label: "Qtd atendimentos", valueFormatter }],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function TickPlacementBars() {
  const [tickPlacement, setTickPlacement] = React.useState("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState("middle");

  return (
    <div style={{ width: "100%" }}>
      <TickParamsSelector
        tickPlacement={tickPlacement}
        tickLabelPlacement={tickLabelPlacement}
        setTickPlacement={setTickPlacement}
        setTickLabelPlacement={setTickLabelPlacement}
      />
      <BarChart
        dataset={dataset}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "DT_ATENDIMENTO",
            tickPlacement,
            tickLabelPlacement,
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
}
