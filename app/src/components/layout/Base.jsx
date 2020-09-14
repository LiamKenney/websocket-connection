import React, { memo } from "react";
import PropTypes from "prop-types";
import Menu from "./Menu";
import RocketFooter from "../footer/RocketFooter";

const Base = (props) => (
  <div>
    <Menu />
    <div id="main-section" className="row no-gutters justify-content-center">
      <div id="main-content" className="col col-sm-11 col-md-10 col-lg-8 col-xl-6">{props.children}</div>
      <RocketFooter push={props.history.push} />
    </div>
  </div>
);

Base.propTypes = {
  children: PropTypes.element,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default memo(Base);
