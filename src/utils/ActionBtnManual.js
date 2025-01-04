import React, { useState } from "react";
import { Button } from "semantic-ui-react";
const Actios = (prop) => {
  const [loading, setLoading] = useState(false);
  if (prop.row.pendingAmount !== 0) {
    return (
      <>
        <Button
          size="mini"
          color="green"
          icon="check"
          loading={loading}
          disabled={loading}
          onClick={() => prop.updateStatus(prop.row, "Done", setLoading)}
        />{" "}
       
      </>
    );
  } 
};
export default Actios;
