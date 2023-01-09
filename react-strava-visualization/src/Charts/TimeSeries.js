import * as d3 from "d3";
import { useEffect, useState } from "react";

function TimeSeries(props) {
  const { width, height, csv } = props;

  const [data, setData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    } else {
      fetchData();
    }
  }, [data]);

  const fetchData = async () => {
    let tempData = [];
    await d3.csv(
      csv,
      () => {},
      function (d) {
        //console.log(d);
        tempData.push({
          date: d3.timeParse("%Y-%m-%d")(d.date),
          value: parseFloat(d.value),
        });
      }
    );
    setData(tempData);
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
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis --> it is a date format
    var x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.date;
        })
      )
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

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
        return x(d.date);
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

  return <div id="time_series"></div>;
}

export default TimeSeries;
