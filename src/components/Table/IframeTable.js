import React from "react";

const IframeTable = () => {
  const url = "http://datasaude-app.beloni.dev.br/maps";

  return (
    <>
      <iframe src={url} frameBorder="0" width="100%" height="600" />
    </>
  );
};

export default IframeTable;
