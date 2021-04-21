const h = 500;
const w = 900;
const paddingX = 175;
const paddingY = 100;

const parseYear = d3.timeParse("%Y");
const parseMin = d3.timeParse("%M:%S");

d3.select("#root")
  .append("div")
  .attr("id", "container")
  .append("h1")
  .text("Doping in Professional Bicycle Races")
  .attr("id", "title");

const svg = d3
  .select("#container")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("viewBox", `0 0 ${w} ${h}`);

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((res) => res.json())
  .then((json) => {
    const data = json.map((obj) => {
      return {
        ...obj,
        Year: parseYear(obj.Year),
        Time: parseMin(obj.Time),
      };
    });

    const minYear = d3.min(data, (d) => d.Year);
    const maxYear = d3.max(data, (d) => d.Year);
    const xScale = d3
      .scaleTime()
      .range([paddingX, w - paddingX])
      .domain([minYear, maxYear])
      .nice();

    const minMin = d3.min(data, (d) => d.Time);
    const maxMin = d3.max(data, (d) => d.Time);
    const yScale = d3
      .scaleTime()
      .domain([maxMin, minMin])
      .range([paddingY, h - paddingY])
      .nice();

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
        tooltip
          .style("opacity", 1)
          .attr("data-year", d3.select(e.target).attr("data-xvalue"))
          .selectAll("text")
          .data(localData)
          .text((d) => d);
      })
      .on("mouseout", (e) => {
        tooltip.attr("data-year", "").style("opacity", 0);
      });

    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .attr("transform", `translate(0, ${h - paddingY + 20})`)
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("color", "rgb(221, 221, 221)")
      .tickSize(200);

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${w / 2}, ${h - paddingY + 60})`)
      .text("Year")
      .attr("font-weight", "bold")
      .attr("fill", "rgb(221, 221, 221)");

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
    svg
      .append("g")
      .attr("transform", `translate(${paddingX - 20}, 0)`)
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("color", "rgb(221, 221, 221)");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${paddingX - 75}, ${h / 2}) rotate(-90)`)
      .text("Finish Time")
      .attr("font-weight", "bold")
      .attr("fill", "rgb(221, 221, 221)");

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

    const tooltip = svg.append("g").attr("id", "tooltip").style("opacity", 0);

    tooltip
      .append("rect")
      .attr("width", 180)
      .attr("height", 70)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", "gray");

    tooltip
      .append("text")
      .attr("x", 10)
      .attr("y", 20)
      .attr("fill", "rgb(221, 221, 221)");

    tooltip
      .append("text")
      .attr("x", 10)
      .attr("y", 40)
      .attr("fill", "rgb(221, 221, 221)");

    tooltip
      .append("text")
      .attr("x", 10)
      .attr("y", 60)
      .attr("fill", "rgb(221, 221, 221)");

    svg.on("mousemove", function (e) {
      const mouse = d3.pointer(e);
      tooltip.attr(
        "transform",
        `translate(${mouse[0] + 15}, ${mouse[1] - 25})`
      );
    });

    // Lines to complete axis

    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", 200)
      .attr("y1", 0)
      .attr("y2", 200)
      .attr("fill", "black");
  });
