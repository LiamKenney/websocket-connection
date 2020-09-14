import React, { memo } from "react";

const Label = (props) => {
  const { x, y, payload, formatter, slant } = props;
  const text = formatter(payload.value);
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform={`rotate(${slant ? "-20" : "0"})`}
      >
        {text}
      </text>
    </g>
  );
};

export default memo(Label);
