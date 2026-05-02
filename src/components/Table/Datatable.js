import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const URL = `${process.env.REACT_APP_API_URL}/api/v1/poluentes`;

export default function DataTableComponent({ poluentesHelper }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios
      .get(URL)
      .then((response) => {
        if (cancelled) return;
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.Payload || response.data?.data || [];
        setRows(data.map((row, idx) => ({ id: row.id ?? idx, ...row })));
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Erro ao carregar poluentes:", err);
          setRows([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={poluentesHelper.poluentesColumns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50]}
        density="compact"
        disableRowSelectionOnClick
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "background.default",
            borderBottom: 1,
            borderColor: "divider",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "0.8125rem",
          },
        }}
      />
    </Box>
  );
}

DataTableComponent.propTypes = {
  poluentesHelper: PropTypes.shape({
    poluentesColumns: PropTypes.array.isRequired,
  }).isRequired,
};
