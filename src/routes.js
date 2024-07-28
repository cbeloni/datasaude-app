/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import BarChart from "@material-ui/icons/BarChart";
import BlurOn from "@material-ui/icons/BlurOn";
import LocationOn from "@material-ui/icons/LocationOn";
import Assistant from "@material-ui/icons/Assistant";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import PrevisaoPage from "views/Previsao/Previsao.js";
import IndicadoresPage from "views/Indicadores/Indicadores.js";
import TableList from "views/TableList/TableList.js";
import Maps from "views/Maps/Maps.js";
import ChatiaPage from "views/Chat-ia/ChatiaPage.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/previsao",
    name: "Previsão",
    icon: BlurOn,
    component: PrevisaoPage,
    layout: "/admin",
  },
  {
    path: "/chat-ia",
    name: "IA Chat",
    icon: Assistant,
    component: ChatiaPage,
    layout: "/admin",
  },
  {
    path: "/indicadores",
    name: "Indicadores",
    icon: BarChart,
    component: IndicadoresPage,
    layout: "/admin",
  },
  // {
  //   path: "/user",
  //   name: "User Profile",
  //   rtlName: "ملف تعريفي للمستخدم",
  //   icon: Person,
  //   component: UserProfile,
  //   layout: "/admin",
  // },
  {
    path: "/table",
    name: "Tabelas",
    icon: "content_paste",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Mapas",
    icon: LocationOn,
    component: Maps,
    layout: "/admin",
  },
];

export default dashboardRoutes;
