import React from "react";
import { DataGrid } from "tubular-react";
import { LocalStorage } from "tubular-common";
import PropTypes from "prop-types";

function DataTableComponent(props) {
  const { poluentesHelper } = props;
  return (
    <div>
      <DataGrid
        gridName="Tubular-React"
        columns={poluentesHelper.poluentesColumns}
        dataSource={`${process.env.REACT_APP_API_URL}/api/v1/poluentes`}
        storage={new LocalStorage()}
        onPageChange={(params) => {
          console.log("===params===", params);
        }}
      />
    </div>
  );
}

DataTableComponent.propTypes = {
  poluentesHelper: PropTypes.object,
};

export default DataTableComponent;
