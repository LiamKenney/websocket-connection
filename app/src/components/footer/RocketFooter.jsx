import React, { memo } from "react";
import PropTypes from "prop-types";
import { ImRocket } from "react-icons/im";
import "./rf.css";

const RocketFooter = (props) => {
  return (
    <div id="footer" className={props.className || null}>
      <div className="footer-return">
        <a
          type="link"
          onClick={() => {
            props.push("/");
          }}
        >
          HOME
        </a>
      </div>
      <a
        type="link"
        onClick={() => {
          props.push("/");
        }}
      >
        <ImRocket color="#1aa14a" size="4rem" className="footer-image" />
      </a>
    </div>
  );
};

RocketFooter.propTypes = {
  push: PropTypes.func,
};

export default memo(RocketFooter);
