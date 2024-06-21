const xLabels = [
  "2022-01-01",
  "2022-01-02",
  "2022-01-03",
  "2022-01-04",
  "2022-01-05",
  "2022-01-06",
  "2022-01-07",
  "2022-01-08",
  "2022-01-09",
  "2022-01-10",
  "2022-01-11",
  "2022-01-12",
  "2022-01-13",
  "2022-01-14",
  "2022-01-15",
  "2022-01-16",
  "2022-01-17",
  "2022-01-18",
  "2022-01-19",
  "2022-01-20",
  "2022-01-21",
  "2022-01-22",
  "2022-01-23",
  "2022-01-24",
  "2022-01-25",
  "2022-01-26",
  "2022-01-27",
  "2022-01-28",
  "2022-01-29",
  "2022-01-30",
  "2022-01-31",
  "2022-02-01",
  "2022-02-02",
  "2022-02-03",
  "2022-02-04",
  "2022-02-05",
  "2022-02-06",
  "2022-02-07",
  "2022-02-08",
  "2022-02-09",
  "2022-02-10",
  "2022-02-11",
  "2022-02-12",
  "2022-02-13",
  "2022-02-14",
  "2022-02-15",
  "2022-02-16",
  "2022-02-17",
  "2022-02-18",
  "2022-02-19",
  "2022-02-20",
  "2022-02-21",
  "2022-02-22",
  "2022-02-23",
  "2022-02-24",
  "2022-02-25",
  "2022-02-26",
  "2022-02-27",
  "2022-02-28",
  "2022-03-01",
  "2022-03-02",
  "2022-03-03",
  "2022-03-04",
  "2022-03-05",
  "2022-03-06",
  "2022-03-07",
  "2022-03-08",
  "2022-03-09",
  "2022-03-10",
  "2022-03-11",
  "2022-03-12",
  "2022-03-13",
  "2022-03-14",
  "2022-03-15",
  "2022-03-16",
  "2022-03-17",
  "2022-03-18",
  "2022-03-19",
  "2022-03-20",
  "2022-03-21",
  "2022-03-22",
  "2022-03-23",
  "2022-03-24",
  "2022-03-25",
  "2022-03-26",
  "2022-03-27",
  "2022-03-28",
  "2022-03-29",
  "2022-03-30",
  "2022-03-31",
  "2022-04-01",
  "2022-04-02",
  "2022-04-03",
  "2022-04-04",
  "2022-04-05",
  "2022-04-06",
  "2022-04-07",
  "2022-04-08",
  "2022-04-09",
  "2022-04-10",
  "2022-04-11",
  "2022-04-12",
  "2022-04-13",
  "2022-04-14",
  "2022-04-15",
  "2022-04-16",
  "2022-04-17",
  "2022-04-18",
  "2022-04-19",
  "2022-04-20",
  "2022-04-21",
  "2022-04-22",
  "2022-04-23",
  "2022-04-24",
  "2022-04-25",
  "2022-04-26",
  "2022-04-27",
  "2022-04-28",
  "2022-04-29",
  "2022-04-30",
  "2022-05-01",
  "2022-05-02",
  "2022-05-03",
  "2022-05-04",
  "2022-05-05",
  "2022-05-06",
  "2022-05-07",
  "2022-05-08",
  "2022-05-09",
  "2022-05-10",
  "2022-05-11",
  "2022-05-12",
  "2022-05-13",
  "2022-05-14",
  "2022-05-15",
  "2022-05-16",
  "2022-05-17",
  "2022-05-18",
  "2022-05-19",
  "2022-05-20",
  "2022-05-21",
  "2022-05-22",
  "2022-05-23",
  "2022-05-24",
  "2022-05-25",
  "2022-05-26",
  "2022-05-27",
  "2022-05-28",
  "2022-05-29",
  "2022-05-30",
  "2022-05-31",
  "2022-06-01",
  "2022-06-02",
  "2022-06-03",
  "2022-06-04",
  "2022-06-05",
  "2022-06-06",
  "2022-06-07",
  "2022-06-08",
  "2022-06-09",
  "2022-06-10",
  "2022-06-11",
  "2022-06-12",
  "2022-06-13",
  "2022-06-14",
  "2022-06-15",
  "2022-06-16",
  "2022-06-17",
  "2022-06-18",
  "2022-06-19",
  "2022-06-20",
  "2022-06-21",
  "2022-06-22",
  "2022-06-23",
  "2022-06-24",
  "2022-06-25",
  "2022-06-26",
  "2022-06-27",
  "2022-06-28",
  "2022-06-29",
  "2022-06-30",
  "2022-07-01",
  "2022-07-02",
  "2022-07-03",
  "2022-07-04",
  "2022-07-05",
  "2022-07-06",
  "2022-07-07",
  "2022-07-08",
  "2022-07-09",
  "2022-07-10",
  "2022-07-11",
  "2022-07-12",
  "2022-07-13",
  "2022-07-14",
  "2022-07-15",
  "2022-07-16",
  "2022-07-17",
  "2022-07-18",
  "2022-07-19",
  "2022-07-20",
  "2022-07-21",
  "2022-07-22",
  "2022-07-23",
  "2022-07-24",
  "2022-07-25",
  "2022-07-26",
  "2022-07-27",
  "2022-07-28",
  "2022-07-29",
  "2022-07-30",
  "2022-07-31",
  "2022-08-01",
  "2022-08-02",
  "2022-08-03",
  "2022-08-04",
  "2022-08-05",
  "2022-08-06",
  "2022-08-07",
  "2022-08-08",
  "2022-08-09",
  "2022-08-10",
  "2022-08-11",
  "2022-08-12",
  "2022-08-13",
  "2022-08-14",
  "2022-08-15",
  "2022-08-16",
  "2022-08-17",
  "2022-08-18",
  "2022-08-19",
  "2022-08-20",
  "2022-08-21",
  "2022-08-22",
  "2022-08-23",
  "2022-08-24",
  "2022-08-25",
  "2022-08-26",
  "2022-08-27",
  "2022-08-28",
  "2022-08-29",
  "2022-08-30",
  "2022-08-31",
  "2022-09-01",
  "2022-09-02",
  "2022-09-03",
  "2022-09-04",
  "2022-09-05",
  "2022-09-06",
  "2022-09-07",
  "2022-09-08",
  "2022-09-09",
  "2022-09-10",
  "2022-09-11",
  "2022-09-12",
  "2022-09-13",
  "2022-09-14",
  "2022-09-15",
  "2022-09-16",
  "2022-09-17",
  "2022-09-18",
  "2022-09-19",
  "2022-09-20",
  "2022-09-21",
  "2022-09-22",
  "2022-09-23",
  "2022-09-24",
  "2022-09-25",
  "2022-09-26",
  "2022-09-27",
  "2022-09-28",
  "2022-09-29",
  "2022-09-30",
  "2022-10-01",
  "2022-10-02",
  "2022-10-03",
  "2022-10-04",
  "2022-10-05",
  "2022-10-06",
  "2022-10-07",
  "2022-10-08",
  "2022-10-09",
  "2022-10-10",
  "2022-10-11",
  "2022-10-12",
  "2022-10-13",
  "2022-10-14",
  "2022-10-15",
  "2022-10-16",
  "2022-10-17",
  "2022-10-18",
  "2022-10-19",
  "2022-10-20",
  "2022-10-21",
  "2022-10-22",
  "2022-10-23",
  "2022-10-24",
  "2022-10-25",
  "2022-10-26",
  "2022-10-27",
  "2022-10-28",
  "2022-10-29",
  "2022-10-30",
  "2022-10-31",
  "2022-11-01",
  "2022-11-02",
  "2022-11-03",
  "2022-11-04",
  "2022-11-05",
  "2022-11-06",
  "2022-11-07",
  "2022-11-08",
  "2022-11-09",
  "2022-11-10",
  "2022-11-11",
  "2022-11-12",
  "2022-11-13",
  "2022-11-14",
  "2022-11-15",
  "2022-11-16",
  "2022-11-17",
  "2022-11-18",
  "2022-11-19",
  "2022-11-20",
  "2022-11-21",
  "2022-11-22",
  "2022-11-23",
  "2022-11-24",
  "2022-11-25",
  "2022-11-26",
  "2022-11-27",
  "2022-11-28",
  "2022-11-29",
  "2022-11-30",
  "2022-12-01",
  "2022-12-02",
  "2022-12-03",
  "2022-12-04",
  "2022-12-05",
  "2022-12-06",
  "2022-12-07",
  "2022-12-08",
  "2022-12-09",
  "2022-12-10",
  "2022-12-11",
  "2022-12-12",
  "2022-12-13",
  "2022-12-14",
  "2022-12-15",
  "2022-12-16",
  "2022-12-17",
  "2022-12-18",
  "2022-12-19",
  "2022-12-20",
  "2022-12-21",
  "2022-12-22",
  "2022-12-23",
  "2022-12-24",
  "2022-12-25",
  "2022-12-26",
  "2022-12-27",
  "2022-12-28",
  "2022-12-29",
  "2022-12-30",
  "2022-12-31",
  "2023-01-01",
  "2023-01-01",
  "2023-01-02",
  "2023-01-02",
  "2023-01-03",
  "2023-01-03",
  "2023-01-04",
  "2023-01-04",
  "2023-01-05",
  "2023-01-05",
  "2023-01-06",
  "2023-01-06",
  "2023-01-07",
  "2023-01-07",
  "2023-01-08",
  "2023-01-08",
  "2023-01-09",
  "2023-01-09",
  "2023-01-10",
  "2023-01-10",
  "2023-01-11",
  "2023-01-11",
  "2023-01-12",
  "2023-01-12",
  "2023-01-13",
  "2023-01-13",
  "2023-01-14",
  "2023-01-14",
  "2023-01-15",
  "2023-01-15",
  "2023-01-16",
  "2023-01-16",
  "2023-01-17",
  "2023-01-17",
  "2023-01-18",
  "2023-01-18",
  "2023-01-19",
  "2023-01-19",
  "2023-01-20",
  "2023-01-20",
  "2023-01-21",
  "2023-01-21",
  "2023-01-22",
  "2023-01-22",
  "2023-01-23",
  "2023-01-23",
  "2023-01-24",
  "2023-01-24",
  "2023-01-25",
  "2023-01-25",
  "2023-01-26",
  "2023-01-26",
  "2023-01-27",
  "2023-01-27",
  "2023-01-28",
  "2023-01-28",
  "2023-01-29",
  "2023-01-29",
  "2023-01-30",
  "2023-01-30",
  "2023-01-31",
  "2023-01-31",
  "2023-02-01",
  "2023-02-01",
  "2023-02-02",
  "2023-02-02",
  "2023-02-03",
  "2023-02-03",
  "2023-02-04",
  "2023-02-04",
  "2023-02-05",
  "2023-02-05",
  "2023-02-06",
  "2023-02-06",
  "2023-02-07",
  "2023-02-07",
  "2023-02-08",
  "2023-02-08",
  "2023-02-09",
  "2023-02-09",
  "2023-02-10",
  "2023-02-10",
  "2023-02-11",
  "2023-02-11",
  "2023-02-12",
  "2023-02-12",
  "2023-02-13",
  "2023-02-13",
  "2023-02-14",
  "2023-02-14",
  "2023-02-15",
  "2023-02-15",
  "2023-02-16",
  "2023-02-16",
  "2023-02-17",
  "2023-02-17",
  "2023-02-18",
  "2023-02-18",
  "2023-02-19",
  "2023-02-19",
  "2023-02-20",
  "2023-02-20",
  "2023-02-21",
  "2023-02-21",
  "2023-02-22",
  "2023-02-22",
  "2023-02-23",
  "2023-02-23",
  "2023-02-24",
  "2023-02-24",
  "2023-02-25",
  "2023-02-25",
  "2023-02-26",
  "2023-02-26",
  "2023-02-27",
  "2023-02-27",
  "2023-02-28",
  "2023-02-28",
  "2023-03-01",
  "2023-03-01",
  "2023-03-02",
  "2023-03-02",
  "2023-03-03",
  "2023-03-03",
  "2023-03-04",
  "2023-03-04",
  "2023-03-05",
  "2023-03-05",
  "2023-03-06",
  "2023-03-06",
  "2023-03-07",
  "2023-03-07",
  "2023-03-08",
  "2023-03-08",
  "2023-03-09",
  "2023-03-09",
  "2023-03-10",
  "2023-03-10",
  "2023-03-11",
  "2023-03-11",
  "2023-03-12",
  "2023-03-12",
  "2023-03-13",
  "2023-03-13",
  "2023-03-14",
  "2023-03-14",
  "2023-03-15",
  "2023-03-15",
  "2023-03-16",
  "2023-03-16",
  "2023-03-17",
  "2023-03-17",
  "2023-03-18",
  "2023-03-18",
  "2023-03-19",
  "2023-03-19",
  "2023-03-20",
  "2023-03-20",
  "2023-03-21",
  "2023-03-21",
  "2023-03-22",
  "2023-03-22",
  "2023-03-23",
  "2023-03-23",
  "2023-03-24",
  "2023-03-24",
  "2023-03-25",
  "2023-03-25",
  "2023-03-26",
  "2023-03-26",
  "2023-03-27",
  "2023-03-27",
  "2023-03-28",
  "2023-03-28",
  "2023-03-29",
  "2023-03-29",
  "2023-03-30",
  "2023-03-30",
  "2023-03-31",
  "2023-03-31",
  "2023-04-01",
  "2023-04-01",
  "2023-04-02",
  "2023-04-02",
  "2023-04-03",
  "2023-04-03",
  "2023-04-04",
  "2023-04-04",
  "2023-04-05",
  "2023-04-05",
  "2023-04-06",
  "2023-04-06",
  "2023-04-07",
  "2023-04-07",
  "2023-04-08",
  "2023-04-08",
  "2023-04-09",
  "2023-04-09",
  "2023-04-10",
  "2023-04-10",
  "2023-04-11",
  "2023-04-11",
  "2023-04-12",
  "2023-04-12",
  "2023-04-13",
  "2023-04-13",
  "2023-04-14",
  "2023-04-14",
  "2023-04-15",
  "2023-04-15",
  "2023-04-16",
  "2023-04-16",
  "2023-04-17",
  "2023-04-17",
  "2023-04-18",
  "2023-04-18",
  "2023-04-19",
  "2023-04-19",
  "2023-04-20",
  "2023-04-20",
  "2023-04-21",
  "2023-04-21",
  "2023-04-22",
  "2023-04-22",
  "2023-04-23",
  "2023-04-23",
  "2023-04-24",
  "2023-04-24",
  "2023-04-25",
  "2023-04-25",
  "2023-04-26",
  "2023-04-26",
  "2023-04-27",
  "2023-04-27",
  "2023-04-28",
  "2023-04-28",
  "2023-04-29",
  "2023-04-30",
];

const historico = [
  "126",
  "139",
  "129",
  "91",
  "117",
  "126",
  "105",
  "90",
  "112",
  "84",
  "79",
  "105",
  "118",
  "100",
  "91",
  "83",
  "106",
  "102",
  "78",
  "110",
  "86",
  "70",
  "78",
  "72",
  "83",
  "85",
  "82",
  "41",
  "48",
  "53",
  "75",
  "47",
  "48",
  "51",
  "51",
  "46",
  "50",
  "71",
  "55",
  "65",
  "71",
  "47",
  "68",
  "80",
  "108",
  "78",
  "92",
  "92",
  "91",
  "97",
  "100",
  "140",
  "133",
  "116",
  "167",
  "102",
  "106",
  "116",
  "138",
  "124",
  "140",
  "152",
  "113",
  "89",
  "113",
  "141",
  "112",
  "114",
  "117",
  "82",
  "138",
  "125",
  "139",
  "124",
  "132",
  "117",
  "114",
  "156",
  "157",
  "156",
  "145",
  "166",
  "177",
  "139",
  "173",
  "155",
  "162",
  "172",
  "153",
  "161",
  "123",
  "172",
  "161",
  "182",
  "177",
  "163",
  "177",
  "134",
  "155",
  "170",
  "199",
  "169",
  "178",
  "157",
  "175",
  "182",
  "155",
  "179",
  "174",
  "172",
  "215",
  "152",
  "136",
  "159",
  "228",
  "178",
  "141",
  "149",
  "140",
  "160",
  "143",
  "160",
  "180",
  "163",
  "149",
  "147",
  "138",
  "156",
  "168",
  "171",
  "183",
  "154",
  "138",
  "197",
  "158",
  "174",
  "153",
  "126",
  "172",
  "141",
  "185",
  "118",
  "180",
  "158",
  "196",
  "183",
  "172",
  "162",
  "188",
  "189",
  "166",
  "170",
  "155",
  "126",
  "116",
  "145",
  "175",
  "110",
  "140",
  "134",
  "108",
  "119",
  "129",
  "151",
  "123",
  "149",
  "124",
  "142",
  "153",
  "151",
  "137",
  "132",
  "134",
  "148",
  "109",
  "99",
  "114",
  "146",
  "117",
  "115",
  "132",
  "117",
  "120",
  "135",
  "144",
  "113",
  "122",
  "130",
  "99",
  "112",
  "94",
  "140",
  "98",
  "106",
  "101",
  "89",
  "109",
  "110",
  "106",
  "96",
  "109",
  "93",
  "95",
  "87",
  "105",
  "123",
  "78",
  "91",
  "111",
  "87",
  "76",
  "112",
  "109",
  "100",
  "110",
  "86",
  "101",
  "139",
  "118",
  "149",
  "122",
  "141",
  "153",
  "94",
  "120",
  "139",
  "191",
  "127",
  "134",
  "141",
  "84",
  "125",
  "123",
  "142",
  "117",
  "148",
  "147",
  "120",
  "137",
  "139",
  "157",
  "144",
  "113",
  "116",
  "145",
  "140",
  "149",
  "165",
  "165",
  "152",
  "184",
  "140",
  "128",
  "144",
  "161",
  "144",
  "167",
  "117",
  "129",
  "142",
  "134",
  "189",
  "170",
  "188",
  "178",
  "153",
  "167",
  "164",
  "183",
  "173",
  "147",
  "151",
  "100",
  "140",
  "143",
  "195",
  "160",
  "176",
  "146",
  "124",
  "130",
  "142",
  "187",
  "149",
  "134",
  "189",
  "131",
  "117",
  "129",
  "179",
  "137",
  "139",
  "147",
  "135",
  "143",
  "139",
  "162",
  "155",
  "145",
  "106",
  "111",
  "134",
  "110",
  "144",
  "146",
  "120",
  "158",
  "124",
  "119",
  "140",
  "167",
  "160",
  "142",
  "153",
  "122",
  "108",
  "97",
  "129",
  "141",
  "124",
  "105",
  "83",
  "103",
  "106",
  "134",
  "118",
  "120",
  "108",
  "113",
  "99",
  "105",
  "127",
  "110",
  "112",
  "114",
  "88",
  "95",
  "103",
  "100",
  "120",
  "113",
  "91",
  "89",
  "90",
  "93",
  "147",
  "99",
  "102",
  "81",
  "82",
  "105",
  "117",
  "97",
  "93",
  "99",
  "104",
  "75",
  "48",
  "81",
  "107",
  "83",
  "59",
  "82",
  "83",
  "42",
  "48",
  "61",
  "67",
  "74",
  "58",
  "57",
  "47",
  "56",
  "51",
  "58",
  "64",
  "43",
  "47",
  "63",
  "47",
  "49",
  "39",
  "54",
  "44",
  "50",
  "34",
  "56",
  "70",
  "67",
  "63",
  "76",
  "65",
  "91",
  "87",
  "79",
  "60",
  "81",
  "82",
  "83",
  "102",
  "106",
  "119",
  "91",
  "128",
  "126",
  "122",
  "140",
  "127",
  "172",
  "126",
  "137",
  "112",
  "109",
  "127",
  "114",
  "120",
  "139",
  "140",
  "123",
  "115",
  "107",
  "122",
  "99",
  "107",
  "119",
  "87",
  "123",
  "134",
  "124",
  "135",
  "136",
  "104",
  "153",
  "125",
  "143",
  "182",
  "150",
  "153",
  "155",
  "145",
  "165",
  "155",
  "191",
  "185",
  "185",
  "201",
  "157",
  "158",
  "157",
  "185",
  "179",
  "179",
  "214",
  "153",
  "158",
  "159",
  "188",
  "217",
  "157",
  "170",
  "116",
  "160",
  "172",
  "168",
  "227",
  "186",
  "186",
  "158",
  "148",
  "187",
  "203",
  "235",
  "177",
  "152",
  "119",
  "149",
  "165",
  "209",
  "203",
  "166",
  "158",
  "143",
  "57",
  "null",
  "null",
];

const previsao = [
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "null",
  "68.97651106819542",
  "63.19711921156619",
  "59.91333365658465",
  "55.800745004114546",
  "48.51936324885304",
  "37.29688349793745",
  "73.52982271254622",
  "59.42932727828215",
  "54.690415381179925",
  "47.93984706432354",
  "38.20688986877727",
  "59.978882323968264",
  "58.725884359990395",
  "44.919174911341244",
  "56.22774330355198",
  "50.86993593025233",
  "35.01318670136493",
  "40.15793605602073",
  "33.27087354897081",
  "47.82348870677359",
  "57.81101752714379",
  "33.89589702092811",
  "19.773122310106515",
  "33.167197187183255",
  "23.679247584482752",
  "29.239234746130307",
  "33.07395369761806",
  "31.99858385306601",
  "29.012916340218084",
  "34.03388980226315",
  "19.640084101143714",
  "29.216957688879795",
  "58.77859027358103",
  "40.405590166159925",
  "61.01498483415958",
  "50.757594065747",
  "48.374438527901255",
  "65.0654140046864",
  "41.91513414577522",
  "69.10844951556298",
  "63.57049628103282",
  "96.46877520596507",
  "64.60918212609776",
  "67.67187281696889",
  "74.20249068983334",
  "47.3477956642836",
  "87.86738962089827",
  "83.30845545215209",
  "84.14975304900052",
  "97.23332157122277",
  "80.00549811961147",
  "81.41159224738763",
  "72.96367925252291",
  "92.48065870803183",
  "86.40743572168861",
  "103.32471167116871",
  "102.80688140774319",
  "67.73852654944432",
  "57.11470738923009",
  "83.54315169303268",
  "95.09375150166497",
  "85.01134862305817",
  "93.9248283306586",
  "95.37374346760079",
  "71.2681820233222",
  "115.23390233736978",
  "86.70947984816465",
  "87.62568858002528",
  "87.84465761270741",
  "100.04265624161522",
  "83.8003191049086",
  "93.56515141051129",
  "89.64987698913465",
  "96.11844921794645",
  "102.02979793174343",
  "92.46682068731072",
  "130.37561117736908",
  "126.45874736450509",
  "116.42340952636539",
  "128.58482450257975",
  "107.2176568587879",
  "117.7656793143135",
  "121.289991160148",
  "121.15714290573044",
  "120.07404875860192",
  "87.97625932584202",
  "114.10686165030914",
  "82.75866972778897",
  "113.08117915779206",
  "111.94003871117803",
  "130.90413458402872",
  "120.14027047084386",
  "106.56220134083253",
  "101.6977099588427",
  "97.91196773789508",
  "115.26690285294524",
  "106.32778520974401",
  "133.34759513499728",
  "103.72388020931717",
  "105.09507620444167",
  "136.09185085852994",
  "93.36087674159162",
  "98.15040620979305",
  "101.59010030357163",
  "125.5336854515167",
  "125.72837042851316",
  "95.26686140839405",
  "91.12880700256753",
  "96.331813514041",
  "134.60044420621975",
  "107.71749455897957",
  "100.85355541164097",
  "101.29531889053436",
  "91.72613074110399",
  "82.05410117090761",
  "76.06988524896808",
  "96.02140724142758",
  "93.9193098536046",
  "102.53659719052241",
  "96.52688076796136",
];

export { xLabels, previsao, historico };
