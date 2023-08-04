const diCaprioBirthYear = 1974;
const age = function (year) {
    return year - diCaprioBirthYear;
};
const today = new Date().getFullYear();
const ageToday = age(today);

// ----------------------------------------------------------

const width = 800;
const height = 600;
const margin = {
    top: 80,
    bottom: 40,
    left: 40,
    right: 10,
};

const svg = d3
    .select("div#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const elementGroup = svg
    .append("g")
    .attr("class", "elementGroup")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const axisGroup = svg.append("g").attr("class", "axisGroup");

const xAxisGroup = axisGroup
    .append("g")
    .attr("class", "xAxisGroup")
    .attr("transform", `translate(${margin.left},${height - margin.bottom})`);

const yAxisGroup = axisGroup
    .append("g")
    .attr("class", "yAxisGroup")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const tipGroup = elementGroup
    .append("g")
    .attr("class", "tipGroup hide")
    .attr("transform", `translate(${30},${5})`);

const nombre = tipGroup.append("text");

const x = d3
    .scaleBand()
    .range([0, width - margin.left - margin.right])
    .padding(0.1);
const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

const xAxis = d3.axisBottom().scale(x);
const yAxis = d3.axisLeft().scale(y);

let title = svg
    .append("text")
    .attr("class", "title")
    .text("Leonardo Di Caprio y sus ex")
    .attr("transform", `translate(${margin.left},${30})`);

d3.csv("data.csv").then((data) => {
    data.map((d) => {
        d.year = +d.year;
        d.age = +d.age;
    });

    //x.domain(d3.extent(data.map((d) => d.year)));
    //y.domain(d3.extent(data.map((d) => d.age)));

    x.domain(data.map((d) => d.year));

    //y.domain([15, d3.max(data.map((d) => d.age))]);
    y.domain([15, 50]);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    const elements = elementGroup.selectAll("rect").data(data);

    elements
        .enter()
        .append("rect")
        .attr("class", (d) => `${d.name} novia`)
        .attr("x", (d) => x(d.year))
        .attr("y", (d) => y(d.age))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - margin.top - margin.bottom - y(d.age))
        .on("mouseover", show)
        .on("mouseout", hide);

    elementGroup
        .datum(data)
        .append("path")
        .attr("id", "linea")
        .attr(
            "d",
            d3
                .line()
                .x((d) => x(d.year))
                .y((d) => y(age(d.year)))
        );
});

function show(d, i, a) {
    tipGroup.classed("show", true);
    nombre.text(
        "Nombre: " +
            `${d.name}` +
            "\t\t" +
            "Age: " +
            `${d.age}` +
            "Age Diference: " +
            `${age(d.year) - d.age}`
    );
}

function hide(d, i, a) {
    tipGroup.classed("show", false);
}
