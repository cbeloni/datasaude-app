/*!

 =========================================================
 * Material Dashboard React - v1.10.0 based on Material Dashboard - v1.2.0
 =========================================================

 * Product Page: http://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2021 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */

// ##############################
// // // Function that converts from hex color to rgb color
// // // Example: input = #9c27b0 => output = 156, 39, 176
// // // Example: input = 9c27b0 => output = 156, 39, 176
// // // Example: input = #999 => output = 153, 153, 153
// // // Example: input = 999 => output = 153, 153, 153
// #############################
const hexToRgb = (input) => {
  input = input + "";
  input = input.replace("#", "");
  let hexRegex = /[0-9A-Fa-f]/g;
  if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
    throw new Error("input is not a valid hex color.");
  }
  if (input.length === 3) {
    let first = input[0];
    let second = input[1];
    let last = input[2];
    input = first + first + second + second + last + last;
  }
  input = input.toUpperCase();
  let first = input[0] + input[1];
  let second = input[2] + input[3];
  let last = input[4] + input[5];
  return (
    parseInt(first, 16) +
    ", " +
    parseInt(second, 16) +
    ", " +
    parseInt(last, 16)
  );
};

// ##############################
// // // Variables - Styles that are used on more than one component
// #############################

const drawerWidth = 260;

const transition = {
  transition: "all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)",
};

const container = {
  paddingRight: "15px",
  paddingLeft: "15px",
  marginRight: "auto",
  marginLeft: "auto",
};

const defaultFont = {
  fontFamily:
    '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  fontWeight: "400",
  lineHeight: "1.55",
};

const primaryColor = ["#0F766E", "#34D399", "#0B5E58", "#6EE7B7"];
const warningColor = ["#D97706", "#F59E0B", "#B45309", "#FBBF24"];
const dangerColor = ["#E11D48", "#F43F5E", "#BE123C", "#FB7185"];
const successColor = ["#059669", "#10B981", "#047857", "#34D399"];
const infoColor = ["#0891B2", "#22D3EE", "#0E7490", "#67E8F9"];
const roseColor = ["#881337", "#E11D48", "#6B0F2C", "#F43F5E"];
const grayColor = [
  "#8189A0",
  "#5A6478",
  "#1A1F2E",
  "#A8AEC0",
  "#D2D6E0",
  "#E0E2EA",
  "#A8AEC0",
  "#3D465B",
  "#0E1420",
  "#8189A0",
  "#E8EAF0",
  "#EDEEF2",
];
const blackColor = "#0E1420";
const whiteColor = "#FFFFFF";

const boxShadow = {
  boxShadow:
    "0 10px 30px -12px rgba(" +
    hexToRgb(blackColor) +
    ", 0.42), 0 4px 25px 0px rgba(" +
    hexToRgb(blackColor) +
    ", 0.12), 0 8px 10px -5px rgba(" +
    hexToRgb(blackColor) +
    ", 0.2)",
};

const primaryBoxShadow = {
  boxShadow:
    "0 4px 20px 0 rgba(" +
    hexToRgb(blackColor) +
    ",.14), 0 7px 10px -5px rgba(" +
    hexToRgb(primaryColor[0]) +
    ",.4)",
};
const infoBoxShadow = {
  boxShadow:
    "0 4px 20px 0 rgba(" +
    hexToRgb(blackColor) +
    ",.14), 0 7px 10px -5px rgba(" +
    hexToRgb(infoColor[0]) +
    ",.4)",
};
const successBoxShadow = {
  boxShadow:
    "0 4px 20px 0 rgba(" +
    hexToRgb(blackColor) +
    ",.14), 0 7px 10px -5px rgba(" +
    hexToRgb(successColor[0]) +
    ",.4)",
};
const warningBoxShadow = {
  boxShadow:
    "0 4px 20px 0 rgba(" +
    hexToRgb(blackColor) +
    ",.14), 0 7px 10px -5px rgba(" +
    hexToRgb(warningColor[0]) +
    ",.4)",
};
const dangerBoxShadow = {
  boxShadow:
    "0 4px 20px 0 rgba(" +
    hexToRgb(blackColor) +
    ",.14), 0 7px 10px -5px rgba(" +
    hexToRgb(dangerColor[0]) +
    ",.4)",
};
const roseBoxShadow = {
  boxShadow:
    "0 4px 20px 0 rgba(" +
    hexToRgb(blackColor) +
    ",.14), 0 7px 10px -5px rgba(" +
    hexToRgb(roseColor[0]) +
    ",.4)",
};

const warningCardHeader = {
  background:
    "linear-gradient(60deg, " + warningColor[1] + ", " + warningColor[2] + ")",
  ...warningBoxShadow,
};
const successCardHeader = {
  background:
    "linear-gradient(60deg, " + successColor[1] + ", " + successColor[2] + ")",
  ...successBoxShadow,
};
const dangerCardHeader = {
  background:
    "linear-gradient(60deg, " + dangerColor[1] + ", " + dangerColor[2] + ")",
  ...dangerBoxShadow,
};
const infoCardHeader = {
  background:
    "linear-gradient(60deg, " + infoColor[1] + ", " + infoColor[2] + ")",
  ...infoBoxShadow,
};
const primaryCardHeader = {
  background:
    "linear-gradient(60deg, " + primaryColor[1] + ", " + primaryColor[2] + ")",
  ...primaryBoxShadow,
};
const roseCardHeader = {
  background:
    "linear-gradient(60deg, " + roseColor[1] + ", " + roseColor[2] + ")",
  ...roseBoxShadow,
};

const cardActions = {
  margin: "0 20px 10px",
  paddingTop: "10px",
  borderTop: "1px solid " + grayColor[10],
  height: "auto",
  ...defaultFont,
};

const cardHeader = {
  margin: "-20px 15px 0",
  borderRadius: "3px",
  padding: "15px",
};

const card = {
  display: "inline-block",
  position: "relative",
  width: "100%",
  margin: "25px 0",
  boxShadow: "0 1px 4px 0 rgba(" + hexToRgb(blackColor) + ", 0.14)",
  borderRadius: "3px",
  color: "rgba(" + hexToRgb(blackColor) + ", 0.87)",
  background: whiteColor,
};

const defaultBoxShadow = {
  border: "0",
  borderRadius: "3px",
  boxShadow:
    "0 10px 20px -12px rgba(" +
    hexToRgb(blackColor) +
    ", 0.42), 0 3px 20px 0px rgba(" +
    hexToRgb(blackColor) +
    ", 0.12), 0 8px 10px -5px rgba(" +
    hexToRgb(blackColor) +
    ", 0.2)",
  padding: "10px 0",
  transition: "all 150ms ease 0s",
};

const title = {
  color: grayColor[2],
  textDecoration: "none",
  fontWeight: "300",
  marginTop: "30px",
  marginBottom: "25px",
  minHeight: "32px",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  "& small": {
    color: grayColor[1],
    fontWeight: "400",
    lineHeight: "1",
  },
};

const cardTitle = {
  ...title,
  marginTop: "0",
  marginBottom: "3px",
  minHeight: "auto",
  "& a": {
    ...title,
    marginTop: ".625rem",
    marginBottom: "0.75rem",
    minHeight: "auto",
  },
};

const cardSubtitle = {
  marginTop: "-.375rem",
};

const cardLink = {
  "& + $cardLink": {
    marginLeft: "1.25rem",
  },
};

export {
  hexToRgb,
  //variables
  drawerWidth,
  transition,
  container,
  boxShadow,
  card,
  defaultFont,
  primaryColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  blackColor,
  whiteColor,
  primaryBoxShadow,
  infoBoxShadow,
  successBoxShadow,
  warningBoxShadow,
  dangerBoxShadow,
  roseBoxShadow,
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  cardActions,
  cardHeader,
  defaultBoxShadow,
  title,
  cardTitle,
  cardSubtitle,
  cardLink,
};
