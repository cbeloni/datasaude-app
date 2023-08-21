import React from "react";
import styleMap from "./stylesMap";

const IframeMap = () => {
  const url = "http://datasaude-app.beloni.dev.br/maps";

  return (
    <>
      <div style={styleMap.divStyle}>
        <iframe src={url} frameBorder="0" width="100%" height="100%" />
      </div>
    </>
  );
};

export default IframeMap;
