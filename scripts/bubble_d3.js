//Bubbles
const width = 1000
const height = 700
var Size=600
// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height);

// Read data

  d3.json("/getBubble").then( function(data) {
    console.log(data);
    // Size scale for countries
    const size = d3.scaleLinear()
      .domain([0, 10])
      .range([7,80])  // circle will be between 7 and 55 px wide
    // create a tooltip
    const Tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
  
    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event, d) {
      Tooltip
        .style("opacity", 1)
      d3.select(this).style('stroke', '#222')
    }
    const mousemove = function(event, d) {
      Tooltip
        .html('<u>' + d.username + '</u>')
        .style("left", (event.x+10) + "px")
        .style("top", (event.y+10) + "px")
  
    }
    var mouseleave = function(event, d) {
      Tooltip
        .style("opacity", 0);
        d3.select(this).style('stroke', 'none');
        return Tooltip.style('stroke', 'hidden');
    }
  
    // Initialize the circle: all located at the center of the svg area
  
    var node = svg.append("g")
      .selectAll("g")
      .data(data)
  
      .join("circle")
      // .attr("id","mysvg")
        .attr("class", "node")
        .attr("r", d => size(d.participation))
        .attr("cx", width / 2)
        .attr("cy", height / 2)
  
        .style("fill", d => d.color_from_color_from_usermood[0])
        .style("fill-opacity", 0.8)
        .attr("stroke", "none")
        .on("click", function(){
          //trigger modal
          var myModal = new bootstrap.Modal(document.getElementById('mymodal'), {focus:true})
          myModal.show()
  
          var PerChart = new Chart(
            document.getElementById('PersonChart'),
            config2
          );
  
  })
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
  
        .call(d3.drag() // call specific function when circle is dragged
             .on("start", dragstarted)
             .on("drag", dragged)
             .on("end", dragended));
  
     //add text to the group
     function getTextWidth(text, fontSize, fontFace) {
           var a = document.createElement('canvas');
           var b = a.getContext('2d');
           b.font = fontSize + 'px ' + fontFace;
           return b.measureText(text).width;
       }
  
  
     function getMinLength(text,radius) {
  
           l= text.length
  
           for(i=l; i> 0; i--){
  
               t = text.substring(0,i) +".."
               if(getTextWidth(t, (Size/50), 'Helvetica Neue') <= radius*2) return i-5
           }
       }
  
   var text = svg.append("g")
  
        .selectAll("g")
        .data(data)
        .join("text")
        .attr('x', width/2)
        .attr('y', height/2 )
        .style("text-anchor", "middle")
        .style("font-family","Helvetica Neue")
        .style("font-weight","Bold")
        .style("font-size",d=>d.participation*2)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .call(d3.drag() // call specific function when circle is dragged
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended))
        .text(d=>d.username)
        .attr("fill",function(d){
              if(d.color_from_color_from_usermood[0]){
  
                  r = hexToRgb(d.color_from_color_from_usermood[0]).r
                  g = hexToRgb(d.color_from_color_from_usermood[0]).g
                  b = hexToRgb(d.color_from_color_from_usermood[0]).b
  
                  var o = Math.round(((parseInt(r) * 299) + (parseInt(g) * 587) + (parseInt(b) * 114)) /1000);
  
                  if (o > 125 )
                          col = '#000000'
                  else col = '#ffffff'
  
                  return col
              }
  
              });
  
      // show the avatar
    var avatar = svg.append('g')
                    .selectAll("g")
                    .data(data)
                    .join("svg:image")
                    .attr("xlink:href", function(d) {
                      return d.avatar_image_from_avatar_image_from_username[0];
                    })
                    .attr('x',width / 2)
                    .attr('y', height / 2)
                    .attr('width', function(d){return d.participation*5;})
                    .style('opacity', 0.75)
                    .on("mouseover", mouseover) // What to do when hovered
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)
                    .call(d3.drag() // call specific function when circle is dragged
                          .on("start", dragstarted)
                          .on("drag", dragged)
                          .on("end", dragended));
  
  
      function hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
          return r + r + g + g + b + b;
      });
  
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
      }
  
    // Features of the forces applied to the nodes:
    const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.participation)+3) }).iterations(1))
         // Force that avoids circle overlapping
  
    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
          node
              .attr("cx", d => d.x)
              .attr("cy", d => d.y)
          text
              .attr("x", d => d.x)
              .attr("y", d => d.y-d.participation*2)
          avatar
              .attr("x", d => d.x-d.participation*2)
              .attr("y", d => d.y+d.participation)
        });
  
    // What happens when a circle is dragged?
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
  
  
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(.03);
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
      //legend
      //  legend
      svg.append("text").attr("x", 60).attr("y", 100).text("Mood: - ").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("circle").attr("cx",130).attr("cy",100).attr("r", 10).style("fill", "#32CD32")
      svg.append("circle").attr("cx",160).attr("cy",100).attr("r", 10).style("fill", "#228B22")
      svg.append("circle").attr("cx",190).attr("cy",100).attr("r", 10).style("fill", "#556B2F")
      svg.append("text").attr("x", 220).attr("y", 100).text(" + ").style("font-size", "15px").attr("alignment-baseline","middle")

      svg.append("text").attr("x", 20).attr("y", 150).text("Participation: - ").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("circle").attr("cx",132).attr("cy",150).attr("r", 10).style("stroke","black").attr("fill","none")
      svg.append("circle").attr("cx",170).attr("cy",150).attr("r", 20).style("stroke","black").attr("fill","none")
      svg.append("circle").attr("cx",230).attr("cy",150).attr("r", 30).style("stroke","black").attr("fill","none")
      svg.append("text").attr("x", 270).attr("y", 150).text(" + ").style("font-size", "15px").attr("alignment-baseline","middle")

  
  })