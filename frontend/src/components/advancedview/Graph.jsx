import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from "victory";
import { connect } from "react-redux";

function Graph(props) {
  // checks if graphData is empty
  if (props.graphData === undefined) {
    return <div></div>;
  } else {
    return (
      // graph wrapper
      <VictoryChart
        domainPadding={{ x: 10 }}
        padding={{ left: 100, right: 100, bottom: 50, top: 40 }}
        height={150}
        standalone={true}
      >
        <VictoryLabel
          text="Distribution of player rankings"
          x={225}
          y={30}
          textAnchor="middle"
          style={{ fill: "orange" }}
        />
        <VictoryBar
          style={{ data: { fill: "#c43a31" } }}
          data={props.graphData}
          x="Rating"
          y="sum(Instance)"
        />
        <VictoryAxis
          label="Rating"
          style={{
            axisLabel: { fill: "orange" },
            tickLabels: { fill: "white" }
          }}
          fixLabelOverlap
        />
        <VictoryAxis
          dependentAxis
          label="Instances"
          axisLabelComponent={<VictoryLabel x={50} />}
          style={{
            axisLabel: { fill: "orange" },
            tickLabels: { fill: "white" }
          }}
          fixLabelOverlap
        />
      </VictoryChart>
    );
  }
}

function mapStateToProps(state) {
  return {
    graphData: state.searchResults.graphData
  };
}

export default connect(mapStateToProps)(Graph);
