import * as d3 from "d3";
import { useEffect, useState } from "react";

function Histogram(props) {
  const { width, height, csv } = props;

  const [data, setData] = useState({});

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    } else {
      fetchData();
    }
  }, [data]);

  const fetchData = async () => {
    let activityType = {};
    await d3.csv(csv, function (row) {
      if (activityType[row.Activity_Type] > 0) {
        activityType[row.Activity_Type] = activityType[row.Activity_Type] + 1;
      } else {
        activityType[row.Activity_Type] = 1;
      }
    });

    // convert the dictionary to an array
    let activityTypeArray = Object.keys(activityType).map(function (key) {
      return { activity: key, frequency: activityType[key] };
    });

    setData(activityTypeArray);
  };

  const drawChart = () => {
    // declare margins
    const margin = { top: 70, right: 50, bottom: 70, left: 50 };

    // create the svg that holds the chart
    const svg = d3
      .select("#histogram")
      .append("svg")
      .style("background-color", "white")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(0,-${margin.bottom - 10})`);

    // create the x axis scale, scaled to the states
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.activity))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

    // create the y axis scale, scaled from 0 to the max
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.frequency)])
      .range([height - margin.bottom, margin.top]);

    // create a scale between colors that varies by the frequency
    const barColors = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.frequency)])
      .range(["#69b3a2", "orange"]);

    // set the x axis on the bottom.
    // tilts the axis text so it's readable and not smushed.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // set the y axis on the left
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // create the actual bars on the graph, appends a 'rect' for every data element
    // sets the x and y positions relative to the scales already established
    // sets the height according to the yscale
    // static bar width, color is scaled on the y axis
    // finally the bars have an outline
    const bars = svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.activity))
      .attr("y", (d) => yScale(d.frequency))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d.frequency))
      .style("padding", "3px")
      .style("margin", "1px")
      .style("width", (d) => `${d * 10}px`)
      .attr("fill", function (d) {
        return barColors(d.frequency);
      })
      .attr("stroke", "grey")
      .attr("stroke-width", 1);
  };
  return (
    <div>
      <h6>Activity Type Counts</h6>
      <div id="histogram"></div>
    </div>
  );
}

export default Histogram;
