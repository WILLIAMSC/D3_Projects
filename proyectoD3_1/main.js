// CHART START

const width = 800;
const height = 600;
const margin = {
    top: 10,
    bottom: 40,
    left: 80,
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

// 1. aquí hay que poner el código que genera la gráfica
const axis = svg.append("g").attr("class", "axis");

const xAxisGroup = axis
    .append("g")
    .attr("class", "xAxisGroup")
    .attr("transform", `translate(${margin.left},${height - margin.bottom})`);

const yAxisGroup = axis
    .append("g")
    .attr("class", "yAxisGroup")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().range([0, width - margin.left - margin.right]);
const y = d3
    .scaleBand()
    .range([height - margin.top - margin.bottom, 0])
    .padding(0.1);

const xAxis = d3.axisBottom().scale(x);
const yAxis = d3.axisLeft().scale(y);

let years;
let winners;
let originalData;

// data:
d3.csv("WorldCup.csv").then((data) => {
    // 2. aquí hay que poner el código que requiere datos para generar la gráfica
    data.map((d) => {
        d.Year = +d.Year;
    });

    years = data.map((d) => d.Year);

    originalData = data;

    // update:
    update(data);

    slider();
});

// update:
function update(data) {
    // 3. función que actualiza el gráfico
    winners = data.map((d) => d.Winner);

    x.domain([0, 5]); //
    y.domain(winners);

    xAxis.ticks(5);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    const elements = elementGroup.selectAll("rect").data(winners);

    elements
        .enter()
        .append("rect")
        .attr("class", (d) => `$(d.winners) bar`)
        .attr("x", (d) => x(d))
        .attr("y", (d) => y(d))
        .attr("width", (d) => x(winners.filter((item) => item === d).length))
        //.attr(
        //    "width",
        //    (d) =>
        //        width -
        //        margin.left -
        //        margin.right -
        //        x(winners.filter((item) => item === d).length)
        //)
        .attr("height", y.bandwidth());

    elements
        .attr("x", (d) => x(d))
        .attr("y", (d) => y(d))
        .transition()
        .duration(500)
        .attr("width", (d) => x(winners.filter((item) => item === d).length));
    //.attr("height", y.bandwidth());

    elements.exit().remove();
}

// treat data:
function filterDataByYear(year) {
    // 4. función que filtra los datos dependiendo del año que le pasemos (year)
    data = originalData;
    data = data.filter((d) => d.Year <= year);
    update(data);

    d3.select("p#value-time").text(year);
}

// CHART END

// slider:
function slider() {
    // esta función genera un slider:
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years)) // rango años
        .max(d3.max(years))
        .step(4) // cada cuánto aumenta el slider (4 años)
        .width(580) // ancho de nuestro slider en px
        .ticks(years.length)
        .default(years[years.length - 1]) // punto inicio del marcador
        .on("onchange", (val) => {
            // 5. AQUÍ SÓLO HAY QUE CAMBIAR ESTO:

            filterDataByYear(val);
            // hay que filtrar los datos según el valor que marquemos en el slider y luego actualizar la gráfica con update
        });

    // contenedor del slider
    var gTime = d3
        .select("div#slider-time") // div donde lo insertamos
        .append("svg")
        .attr("width", width * 0.8)
        .attr("height", 100)
        .append("g")
        .attr("transform", "translate(30,30)");

    gTime.call(sliderTime); // invocamos el slider en el contenedor

    d3.select("p#value-time").text(sliderTime.value()); // actualiza el año que se representa
}
