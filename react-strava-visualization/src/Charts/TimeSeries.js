import * as d3 from "d3";
import { useEffect, useState } from "react";

function TimeSeries(props) {
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
    let chartData = [];
    await d3.csv(
      csv,
      () => {},
      function (d) {
        const date = d3.timeParse("%Y-%m-%d")(d.Activity_Date);
        const month = date.toLocaleString("default", { month: "long" });

        if (chartData[month] > 0) {
          chartData[month] += 1;
        } else {
          chartData[month] = 1;
        }
      }
    );

    // convert the dictionary to an array
    let chartDataArray = Object.keys(chartData).map(function (key) {
      return { month: key, value: chartData[key] };
    });

    setData(chartDataArray);
  };

  const drawChart = () => {
    const margin = { top: 10, right: 50, bottom: 50, left: 50 };

    // create the chart area
    const svg = d3
      .select("#time_series")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},0)`);

    // Add X axis --> it is a month text
    var x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .rangeRound([0, width - margin.right])
      .padding(0.1);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.value;
        }),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // set line coordinates
    const line = d3
      .line()
      .x(function (d) {
        return x(d.month);
      })
      .y(function (d) {
        return y(d.value);
      });

    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  };

  return (
    <div>
      <h6>Number of Activities Per Month</h6>
      <div id="time_series"></div>
    </div>
  );
}

export default TimeSeries;
