import React from "react";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import IframeTable from "components/Table/IframeTable";

const Maps = () => {
  return (
    <>
      <GridContainer>
        <GridItem xs={12}>
          <IframeTable></IframeTable>
        </GridItem>
      </GridContainer>
    </>
  );
};

export default Maps;
