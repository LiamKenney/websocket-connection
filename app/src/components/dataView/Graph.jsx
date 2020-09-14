import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import Label from "./Label";
import { getMinutes, getBoth } from "../../services/dateService";
const colors = ["#000000", "#1aa14a", "#00e86a"];

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: "dataMin",
      right: "dataMax",
      leftIndex: 0,
      rightIndex: props.data.length,
      refAreaLeft: "",
      refAreaRight: "",
      top: "dataMax+1",
      bottom: "dataMin-1",
      animation: true,
      update: true,
      maxTime: 10,
    };
  }

  componentDidUpdate = () => {
    const { data } = this.props,
      isNonemptyArray = data.length > 0;
    if (isNonemptyArray && this.state.update) {
      this.setState((prevState) => ({
        ...prevState,
        update: false,
      }));
    }
  };

  handleMouseDown = (e) => {
    if (e) {
      this.setState({ refAreaLeft: e.activeLabel });
    }
  };

  handleMouseMove = (e) => {
    if (this.state.refAreaLeft) {
      this.setState({ refAreaRight: e.activeLabel });
    }
  };

  handleMouseUp = () => {
    this.zoom();
    this.props.toggleTimer(false);
  };

  zoom = () => {
    let { refAreaLeft, refAreaRight } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      this.setState(() => ({
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    if (refAreaLeft > refAreaRight) {
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    }
    const [leftIndex, rightIndex] = this.getAxisXIndexes(
      refAreaLeft,
      refAreaRight
    );

    const [bottom, top] = this.getAxisYDomain(refAreaLeft, refAreaRight, 1);

    this.setState(
      (prevState) => ({
        ...prevState,
        refAreaLeft: "",
        refAreaRight: "",
        left: refAreaLeft,
        right: refAreaLeft,
        bottom,
        top,
        leftIndex,
        rightIndex,
      }),
      () => {
        this.props.toggleTimer(false);
        this.props.slider(rightIndex);
      }
    );
  };

  zoomOut = () => {
    this.setState(
      (prevState, prevProps) => ({
        refAreaLeft: "",
        refAreaRight: "",
        left: "dataMin",
        right: "dataMax",
        top: "dataMax+1",
        bottom: "dataMin-1",
        leftIndex: 0,
        rightIndex: prevProps.data.length,
      }),
      () => {
        this.props.slider(this.props.data.length - 1);
      }
    );
  };

  getAxisYDomain = (from, to, offset) => {
    const refData = this.props.data.filter(
      (entry) => entry.time > from - 1 && entry.time < to
    );
    let bottom, top;
    refData.forEach((d) => {
      let keys = Object.keys(d).filter((key) => key !== "time");
      keys.forEach((key) => {
        if (top === undefined || d[key] > top) top = d[key];
        if (bottom === undefined || d[key] < bottom) bottom = d[key];
      });
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
  };

  getAxisXIndexes = (lowerVal, upperVal, offset = 0) => {
    let left, right;
    this.props.data.some((d, index) => {
      let val = d["time"];
      if (!left && val === lowerVal) {
        left = index;
      }
      if (!right && val === upperVal) {
        right = index;
        return true;
      }
      return false;
    });
    return [left - offset, right + offset];
  };

  createLines = () => {
    let elementArray = [];
    const setKeys = this.getSetKeys();
    setKeys.forEach((key, index) => {
      if (this.props.sets[key]) {
        elementArray.push(
          <Line
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            dot={false}
            connectNulls={true}
            isAnimationActive={false}
            key={key}
          />
        );
      }
    });
    return elementArray;
  };

  getSetKeys = () => Object.keys(this.props.sets);

  render = () => {
    const {
      left,
      right,
      refAreaLeft,
      refAreaRight,
      top,
      bottom,
      leftIndex,
      rightIndex,
    } = this.state;
    let data;
    const sliderVal = this.props.slider();
    if (left !== "dataMin" && right !== "dataMax") {
      data = this.props.data.slice(leftIndex, rightIndex);
    } else {
      data = this.props.data.slice(
        Math.max(sliderVal - this.props.entryNum, 0),
        sliderVal
      );
    }
    return (
      <div className="highlight-bar-charts">
        <div className="top-bar d-flex flex-row-reverse">
          <a className="btn btn-primary update" onClick={this.zoomOut}>
            Zoom Out
          </a>
        </div>

        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart
            data={data}
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
            margin={{ top: 5, right: 0, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis
              allowDataOverflow={true}
              domain={[bottom, top]}
              type="number"
              tick={<Label formatter={(val) => val.toFixed(5)} />}
            />
            <Tooltip labelFormatter={getBoth} />
            <XAxis
              dataKey="time"
              tick={<Label slant formatter={getMinutes} />}
              domain={[left, right]}
              allowDataOverflow={true}
            />
            {this.createLines()}
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
}

export default Graph;
