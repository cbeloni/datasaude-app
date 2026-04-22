import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { maxacaliColumns } from "./MaxacaliHelper";

const PAGE_SIZE_DEFAULT = 10;

function DataTableMaxacaliComponent() {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE_DEFAULT,
  });

  const endpoint = useMemo(
    () => `${process.env.REACT_APP_API_URL}/api/v1/maxacali/listar`,
    []
  );

  useEffect(() => {
    let active = true;

    const fetchRows = async () => {
      setLoading(true);
      try {
        const payload = {
          take: paginationModel.pageSize,
          prev: null,
          skip: paginationModel.page * paginationModel.pageSize,
          columns: [],
        };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!active) {
          return;
        }

        setRows(data?.payload || []);
        setRowCount(data?.totalRecordCount || 0);
      } catch (error) {
        if (!active) {
          return;
        }

        console.error("Erro ao carregar tabela Maxacali", error);
        setRows([]);
        setRowCount(0);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchRows();

    return () => {
      active = false;
    };
  }, [endpoint, paginationModel.page, paginationModel.pageSize]);

  return (
    <div style={{ width: "100%", height: 650 }}>
      <DataGrid
        rows={rows}
        columns={maxacaliColumns}
        rowCount={rowCount}
        loading={loading}
        pagination
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
      />
    </div>
  );
}

export default DataTableMaxacaliComponent;
