// Set dimensions
const h = 500;
const w = 950;
const paddingX = 150;
const paddingY = 100;

// Set time parsers for data
const parseYear = d3.timeParse("%Y");
const parseMin = d3.timeParse("%M:%S");

// Create svg
const svg = d3
  .select("main")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("viewBox", `0 0 ${w} ${h}`);

// Fetch info
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((res) => res.json())
  .then((json) => {
    // Parse data
    const data = json.map((obj) => {
      return {
        ...obj,
        Year: parseYear(obj.Year),
        Time: parseMin(obj.Time),
      };
    });

    // X scale
    const minYear = new Date(d3.min(data, (d) => d.Year).getTime());
    const maxYear = d3.max(data, (d) => d.Year);
    const xScale = d3
      .scaleTime()
      .range([paddingX, w - paddingX])
      .domain([minYear.setYear(minYear.getYear() - 2), maxYear])
      .nice();

    // Y scale
    const minMin = new Date(d3.min(data, (d) => d.Time).getTime());
    const maxMin = d3.max(data, (d) => d.Time);
    const yScale = d3
      .scaleTime()
      .domain([maxMin, minMin.setSeconds(minMin.getSeconds() - 15)])
      .range([paddingY, h - paddingY])
      .nice();

    // X axis
    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .attr("transform", `translate(0, ${h - paddingY})`)
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("color", "rgb(221, 221, 221)");

    // X axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${w / 2}, ${h - paddingY + 40})`)
      .text("Year")
      .attr("font-weight", "bold")
      .attr("fill", "rgb(221, 221, 221)");

    // Y axis
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
    svg
      .append("g")
      .attr("transform", `translate(${paddingX}, 0)`)
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("color", "rgb(221, 221, 221)");

    // Y axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${paddingX - 50}, ${h / 2}) rotate(-90)`)
      .text("Finish Time")
      .attr("font-weight", "bold")
      .attr("fill", "rgb(221, 221, 221)");

    // Grid lines for y axis
    svg
      .append("g")
      .attr("transform", `translate(${paddingX}, 0)`)
      .call(
        yAxis
          .ticks(d3.timeSecond.every(30))
          .tickFormat("")
          .tickSize(-w + 2 * paddingX)
      )
      .attr("color", "rgba(221, 221, 221, 0.1)");

    // Add data into graph
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Time))
      .attr("r", 6)
      .attr("fill", (d) => {
        if (d.Doping) return "orange";
        else return "rgb(47, 66, 94)";
      })
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time)
      .attr("class", "dot")
      .on("mouseover", (e, d) => {
        const year = d3.timeFormat("%Y")(d.Year);
        const time = d3.timeFormat("%M:%S")(d.Time);
        const localData = [`Name: ${d.Name}`, `Year: ${year}`, `Time: ${time}`];
        const mouse = d3.pointer(e);

        tooltip
          .attr("transform", `translate(${mouse[0] + 15}, ${mouse[1] - 25})`)
          .style("display", "block")
          .attr("data-year", d3.select(e.target).attr("data-xvalue"))
          .selectAll("text")
          .data(localData)
          .text((val) => val);

        const tooltipTextWidth = d3.max(
          localData.map((val, i) =>
            Math.ceil(
              Number(document.querySelector("#tooltip-" + i).getBBox().width)
            )
          )
        );

        tooltip.select("rect").attr("width", tooltipTextWidth + 25);
      })
      .on("mouseout", (e) => {
        tooltip.attr("data-year", "").style("display", "none");
      });

    // Create legend
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${w - paddingX - 100}, 250)`);

    legend
      .append("rect")
      .attr("width", 200)
      .attr("height", 60)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", "gray");

    legend
      .append("circle")
      .attr("cx", 20)
      .attr("cy", 20)
      .attr("r", 7)
      .attr("fill", "orange");

    legend
      .append("text")
      .attr("x", 35)
      .attr("y", 24)
      .attr("fill", "rgb(221, 221, 221)")
      .text("Doping allegations");

    legend
      .append("circle")
      .attr("cx", 20)
      .attr("cy", 40)
      .attr("r", 7)
      .attr("fill", "rgb(47, 66, 94)");

    legend
      .append("text")
      .attr("x", 35)
      .attr("y", 44)
      .attr("fill", "rgb(221, 221, 221)")
      .text("No doping allegations");

    // Create tooltip
    const tooltip = svg
      .append("g")
      .attr("id", "tooltip")
      .style("display", "none");

    tooltip
      .append("rect")
      .attr("width", 200)
      .attr("height", 66)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", "rgba(120, 120, 120, 0.9)")
      .attr("stroke", "rgba(221, 221, 221, 0.1)");

    tooltip
      .append("text")
      .attr("x", 10)
      .attr("y", 20)
      .attr("id", "tooltip-0")
      .attr("fill", "rgb(221, 221, 221)");

    tooltip
      .append("text")
      .attr("x", 10)
      .attr("y", 38)
      .attr("id", "tooltip-1")
      .attr("fill", "rgb(221, 221, 221)");

    tooltip
      .append("text")
      .attr("x", 10)
      .attr("y", 56)
      .attr("id", "tooltip-2")
      .attr("fill", "rgb(221, 221, 221)");
  });
