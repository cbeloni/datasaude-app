import React from "react";
import styleTable from "./stylesTable.js";

const IframeTable = () => {
  const url = "http://datasaude-app.beloni.dev.br/maps";

  return (
    <>
      <div style={styleTable.divStyle}>
        <iframe src={url} frameBorder="0" width="100%" height="100%" />
      </div>
    </>
  );
};

export default IframeTable;
