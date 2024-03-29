//Bubbles
const width = 900;
const height = 600;
var size = 600;
// append the svg object to the body of the page
const svg = d3
	.select("#my_dataviz")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// Read data
///jsonFile/bubble.json
function bubble(path) {
	d3.json("/jsonFile/bubble.json").then(function (data) {
		// console.log(data);
		// Size scale for countries
		const size = d3.scaleLinear().domain([0, 10]).range([7, 80]);

		// create a tooltip
		const Tooltip = d3
			.select("#my_dataviz")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "5px");

		// Three function that change the tooltip when user hover / move / leave a cell
		const mouseover = function (event, d) {
			Tooltip.style("opacity", 2);
			d3.select(this).style("stroke", "#FFF4D0");
		};

		const mousemove = function (event, d) {
			Tooltip.html("<u>" + d.username + "</u>")
				.style("left", event.x + 10 + "px")
				.style("top", event.y + 10 + "px");
		};

		var mouseleave = function (event, d) {
			Tooltip.style("opacity", 0);
			d3.select(this).style("stroke", "none");
			return Tooltip.style("stroke", "hidden");
		};

		// Initialize the circle: all located at the center of the svg area
		var node = svg
			.append("g")
			.selectAll("g")
			.data(data)
			.join("circle")
			.attr("class", "node")
			.attr("r", (d) => size(d.participation))
			.attr("cx", width / 2)
			.attr("cy", height / 2)
			.attr("id", (d) => d.username)
			.style("fill", (d) => d.color)
			.style("fill-opacity", 0.8)
			.attr("stroke", "none")
			.on("click", function () {
				//get userName
				userName = $(this).attr("id");
				console.log(userName);
				//Trigger angular function
				angular
					.element(
						document.querySelector('[ng-controller="DashboardController"]')
					)
					.scope()
					.personalChart(userName);
				//trigger modal
				var myModal = new bootstrap.Modal(document.getElementById("mymodal"), {
					focus: true,
				});
				myModal.show();
			})
			.on("mouseover", mouseover) // What to do when hovered
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)
			.call(
				d3
					.drag() // call specific function when circle is dragged
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended)
			);

		//add text to the group
		function getTextWidth(text, fontSize, fontFace) {
			var a = document.createElement("canvas");
			var b = a.getContext("2d");
			b.font = fontSize + "px " + fontFace;
			return b.measureText(text).width;
		}

		function getMinLength(text, radius) {
			l = text.length;
			for (i = l; i > 0; i--) {
				t = text.substring(0, i) + "..";
				if (getTextWidth(t, size / 50, "Helvetica Neue") <= radius * 2) {
					return i - 5;
				}
			}
		}
		//Obtain the specific user name with clicking

		// Add text in bubble
		var text = svg
			.append("g")
			.selectAll("g")
			.data(data)
			.join("text")
			.attr("x", width / 2)
			.attr("y", height / 2)
			.style("text-anchor", "middle")
			.style("font-family", "Helvetica Neue")
			.style("font-weight", "Bold")
			.style("font-size", (d) => d.participation * 2)
			.attr("id", (d) => d.username)
			.on("click", function () {
				//get userName
				userName = $(this).text();

				//Trigger angular function
				angular
					.element(
						document.querySelector('[ng-controller="DashboardController"]')
					)
					.scope()
					.personalChart(userName);
				
				//trigger modal
				var myModal = new bootstrap.Modal(document.getElementById("mymodal"), {
					focus: true,
				});
				myModal.show();
			})
			.call(
				d3
					.drag() // call specific function when circle is dragged
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended)
			)
			.text((d) => d.username)
			.attr("fill", function (d) {
				if (d.color) {
					r = hexToRgb(d.color).r;
					g = hexToRgb(d.color).g;
					b = hexToRgb(d.color).b;

					var o = Math.round(
						(parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000
					);
					if (o > 125) col = "#000000";
					else col = "#ffffff";
					return col;
				}
			});

		// show the avatar
		var avatar = svg
			.append("g")
			.selectAll("g")
			.data(data)
			.join("svg:image")
			.attr("xlink:href", function (d) {
				return d.avatar;
			})
			.attr("x", width / 2)
			.attr("y", height / 2)
			.attr("width", function (d) {
				return d.participation * 5;
			})
			.attr("id", (d) => d.username)
			.style("opacity", 0.75)
			.on("click", function () {
				//get userName
				userName = $(this).attr("id");

				//Trigger angular function
				angular
					.element(
						document.querySelector('[ng-controller="DashboardController"]')
					)
					.scope()
					.personalChart(userName);
				//trigger modal
				var myModal = new bootstrap.Modal(document.getElementById("mymodal"), {
					focus: true,
				});
				myModal.show();
			})
			.call(
				d3
					.drag() // call specific function when circle is dragged
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended)
			);

		function hexToRgb(hex) {
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function (m, r, g, b) {
				return r + r + g + g + b + b;
			});

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result
				? {
						r: parseInt(result[1], 16),
						g: parseInt(result[2], 16),
						b: parseInt(result[3], 16),
				  }
				: null;
		}

		// Features of the forces applied to the nodes:
		const simulation = d3
			.forceSimulation()
			.force(
				"center",
				d3
					.forceCenter()
					.x(width / 2)
					.y(height / 2)
			) // Attraction to the center of the svg area
			.force("charge", d3.forceManyBody().strength(950)) // Nodes are attracted one each other of value is > 0
			.force(
				"collide",
				d3
					.forceCollide()
					.strength(0.2)
					.radius(function (d) {
						return size(d.participation) + 3;
					})
					.iterations(1)
			);

		// Force that avoids circle overlapping
		// Apply these forces to the nodes and update their positions.
		// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
		simulation.nodes(data).on("tick", function (d) {
			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
			text.attr("x", (d) => d.x).attr("y", (d) => d.y - d.participation * 2);
			avatar
				.attr("x", (d) => d.x - d.participation * 2)
				.attr("y", (d) => d.y + d.participation);
		});

		// What happens when a circle is dragged?
		function dragstarted(event, d) {
			if (!event.active) {
				simulation.alphaTarget(0.03).restart();
			}

			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(event, d) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(event, d) {
			if (!event.active) {
				simulation.alphaTarget(0.03);
			}
			d.fx = null;
			d.fy = null;
		}

		// Move nodes toward cluster focus.
		function gravity(alpha) {
			return function (d) {
				d.y += (d.cy - d.y) * alpha;
				d.x += (d.cx - d.x) * alpha;
			};
		}
		// Zoom bubble
		var zoom = d3
			.zoom()
			.scaleExtent([1, 8])
			.on("zoom", function (event) {
				svg.selectAll("g").attr("transform", event.transform);
			});

		svg.call(zoom);

	});
}

//display last 7 days' bubble
bubble("/jsonFile/bubble.json");
console.log("Initial last 7 days!");

// Refresh bubble data
d3.select("#refreshBtn").on("click", function () {
	svg.selectAll("g").remove();
	bubble("/jsonFile/bubble.json");
	console.log("Successful refresh !");
});
