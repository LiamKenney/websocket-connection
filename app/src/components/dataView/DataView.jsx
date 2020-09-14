import React from "react";
import { getDataStream, getUrl } from "../../services/socket";
import "./data.css";
import Graph from "./Graph";
import Loading from "../loading/Loading";

class DataView extends React.Component {
  constructor(props) {
    super(props);
    this.ws = this.getSocket();
    this.stack = [];
    this.maxStackLength = 25;
    this.stackSearchSize = 5;
    this.timer = 0;
    this.updateRate = 8;
    this.state = {
      data: [],
      isConnected: false,
      isUpdating: false,
      isCurrent: true,
      sets: {},
      sliderValue: 0,
      entryNum: 1000,
    };
  }

  componentDidMount = () => {
    this.toggleConnection();
  };

  componentWillUnmount = () => {
    if (this.state.connection) {
      this.ws.close();
    }
  };

  getSocket = () => {
    let ws = getDataStream();
    ws.onmessage = this.handleNewData;
    ws.onclose = this.handleClose;
    return ws;
  };

  handleNewData = (msg) => {
    if (this.state.isConnected) {
      const data = JSON.parse(msg.data);
      if (!this.checkForRecentEntry(data, 10)) {
        const formattedData = { time: data.ts, [data.sourceName]: data.val };
        this.stack.push(formattedData);
      }

      if (this.state.sets[data.sourceName] === undefined) {
        this.setState((prevState) => ({
          ...prevState,
          sets: {
            ...prevState.sets,
            [data.sourceName]: true,
          },
        }));
      }
    }
  };

  checkForRecentEntry = (entry, depth = this.stackSearchSize) => {
    const maxDepth = depth,
      minIndex = Math.max(this.stack.length - maxDepth, 0);
    let result = false;
    if (this.stack.length) {
      for (let i = this.stack.length - 1; i >= minIndex; i--) {
        if (this.stack[i].time === entry["ts"]) {
          result = true;
          this.stack[i][entry.sourceName] = entry.val;
          break;
        }
      }
    }
    return result;
  };

  reduceStack = () => {
    let batch = [];
    while (this.stack.length > this.maxStackLength) {
      batch.push(this.stack.shift());
    }
    this.setState((prevState) => {
      const newData = prevState.data.concat(batch);
      return {
        ...prevState,
        data: newData,
        sliderValue: prevState.isCurrent
          ? newData.length
          : prevState.sliderValue,
      };
    });
  };

  handleClose = () => {
    console.log("Disconnected");
  };

  handleSlider = (e) => {
    this.sliderValue(e.target.value);
  };

  toggleLine = (val) => {
    this.setState((prevState) => ({
      ...prevState,
      sets: {
        ...prevState.sets,
        [val]: !prevState.sets[val],
      },
    }));
  };

  toggleConnection = () => {
    this.setState(
      (prevState) => ({
        ...prevState,
        isConnected: !prevState.isConnected,
      }),
      this.toggleUpdater
    );
  };

  toggleUpdater = (val) => {
    if (val === undefined) {
      this.timer = this.timer
        ? clearInterval(this.timer)
        : setInterval(this.reduceStack, 1000 / this.updateRate);
    } else if (val === true) {
      this.timer = setInterval(this.reduceStack, 1000 / this.updateRate);
    } else if (val === false) {
      this.timer = clearInterval(this.timer);
    }
    this.setState(({ isUpdating }) => ({
      isUpdating: !isUpdating,
    }));
  };

  getSetKeys = () => Object.keys(this.state.sets);

  createToggleButtons = () => {
    let buttonArray = [];
    const setKeys = this.getSetKeys();
    setKeys.forEach((key, index) => {
      const isVisible = this.state.sets[key];
      buttonArray.push(
        <div key={index} className="d-flex justify-content-end mb-1 mx-1">
          <button
            onClick={() => this.toggleLine(key)}
            className={`btn btn-primary btn-block ${isVisible ? "" : "hidden"}`}
          >
            {`${isVisible ? "Hide" : "Show"} Line ${key}`}
          </button>
        </div>
      );
    });
    return buttonArray;
  };

  sliderValue = (val) => {
    if (val === undefined) {
      return this.state.sliderValue;
    }
    const dataLen = this.state.data.length,
      isInTop95Perc = val / dataLen > 0.98;
    this.setState((prevState) => ({
      ...prevState,
      sliderValue: isInTop95Perc ? dataLen - 1 : val,
      isCurrent: isInTop95Perc,
    }));
  };

  render() {
    return (
      <div>
        <div className="h3 text-center text-light mb-3">
          WebSocket Connections
        </div>
        <div className="row no-gutters justify-content-center">
          {this.state.data ? (
            <Graph
              data={this.state.data}
              sets={this.state.sets}
              toggleTimer={this.toggleUpdater}
              entryNum={this.state.entryNum}
              slider={this.sliderValue}
            />
          ) : (
            <Loading />
          )}
        </div>
        <div className="row no-gutters justify-content-center button-container">
          <div className="slider-container">
            <input
              type="range"
              min={this.state.entryNum}
              max={this.state.data.length}
              value={
                this.state.isCurrent
                  ? this.state.data.length
                  : this.state.sliderValue
              }
              onChange={this.handleSlider}
              className="slider"
            />
          </div>
          <div className="d-flex flex-row-reverse flex-wrap">
            <div className="col col-xl-2 d-flex justify-content-start align-items-start mx-1">
              <button
                onClick={() => this.toggleUpdater()}
                className="btn btn-primary"
              >
                {this.timer ? "Pause" : "Start"}
              </button>
            </div>
            <div className="col-6 col-xl-3">{this.createToggleButtons()}</div>
            <div className="col-12 col-xl mt-2">
              <div className="h5 text-light">Usage</div>
              <ul>
                <li className="mb-2">{`The plot above shows the data received from the websocket connection with ${getUrl()}.`}</li>
                <li className="mb-2">
                  Use the slider to view past values, and the pause button to
                  stop the plotting of new data.
                </li>
                <li className="mb-2">
                  Click into the graph and drag to highlight a region and
                  inspect more closely. Hit zoom out to return to full-scale.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataView;
