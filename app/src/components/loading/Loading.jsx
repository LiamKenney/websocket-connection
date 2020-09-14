import React, { memo } from "react";
import "./loading.css";

const Loading = (props) => (
  <div className="loading">
    <div className="loading-icon"></div>
  </div>
);

export default memo(Loading);
