import { IMG_DEFAULT } from "./ConstantsMap";

const valueMonths = (value) => {
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

const selectMapa = [
  {
    value:
      "https://br-se-1.magaluobjects.com/v1/AUTH_c090bb3917894ed796de8fda36befc83/maps-pub/2022_mp10_2_1.png",
    label: "2021",
  },
  {
    value: IMG_DEFAULT,
    label: "2022",
  },
];

export { valueMonths, marks, selectMapa };
