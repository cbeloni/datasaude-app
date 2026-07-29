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
import Dashboard from "@mui/icons-material/SpaceDashboardOutlined";
import BarChart from "@mui/icons-material/BarChartOutlined";
import BlurOn from "@mui/icons-material/BlurOnOutlined";
import LocationOn from "@mui/icons-material/PublicOutlined";
import Assistant from "@mui/icons-material/AutoAwesomeOutlined";
import TableIcon from "@mui/icons-material/TableChartOutlined";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import PrevisaoPage from "views/Previsao/Previsao.js";
import IndicadoresPage from "views/Indicadores/Indicadores.js";
import TableList from "views/TableList/TableList.js";
import Maps from "views/Maps/Maps.js";
import ChatiaPage from "views/Chat-ia/ChatiaPage.js";
import People from "@mui/icons-material/PeopleOutlined";
import UsersPage from "views/UserManagement/UsersPage.js";
import {
  MAP_TAB_PERMISSIONS,
  TABLE_TAB_PERMISSIONS,
} from "config/tabPermissions";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
    permission: "dashboard.view",
  },
  {
    path: "/previsao",
    name: "Previsão",
    icon: BlurOn,
    component: PrevisaoPage,
    layout: "/admin",
    permission: "previsao.view",
  },
  {
    path: "/chat-ia",
    name: "IA Chat",
    icon: Assistant,
    component: ChatiaPage,
    layout: "/admin",
    permission: "chat_ia.view",
  },
  {
    path: "/indicadores",
    name: "Indicadores",
    icon: BarChart,
    component: IndicadoresPage,
    layout: "/admin",
    permission: "indicadores.view",
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
    icon: TableIcon,
    component: TableList,
    layout: "/admin",
    permission: "table.view",
    tabPermissions: TABLE_TAB_PERMISSIONS.map((tab) => tab.code),
  },
  {
    path: "/maps",
    name: "Mapas",
    icon: LocationOn,
    component: Maps,
    layout: "/admin",
    permission: "maps.view",
    tabPermissions: MAP_TAB_PERMISSIONS.map((tab) => tab.code),
  },
  {
    path: "/users",
    name: "Usuários",
    icon: People,
    component: UsersPage,
    layout: "/admin",
    permissions: ["users.manage", "roles.manage"],
  },
];

export default dashboardRoutes;
