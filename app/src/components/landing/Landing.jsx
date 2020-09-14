import React, { memo } from "react";
import PropTypes from "prop-types";

const Landing = (props) => {
  return <div className="row no-gutters justify-content-center">
      <button onClick={() => props.history.push("/view-data")} className="btn btn-sm btn-primary">View data</button>
  </div>;
};

Landing.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default memo(Landing);
