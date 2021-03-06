
    // set the dimensions and margins of the graph
    var margin3 = {top: 20, right: 100, bottom: 30, left: 18},
        width3 = 1250 - margin3.left - margin3.right,
        height3 = 700 - margin3.top - margin3.bottom;
    
    // append the svg object to the body of the page
    var svg3 = d3.select("#my_dataviz3")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 "+ (width3 + margin3.left + margin3.right) +"," + (height3 + margin3.top + margin3.bottom)+"")
      .append("g")
        .attr("transform",
              "translate(" + margin3.left + "," + margin3.top + ")");
      //   .attr("width", width3 + margin3.left + margin3.right)
      //   .attr("height", height3 + margin3.top + margin3.bottom)
      // .append("g")
      //   .attr("transform",
      //         "translate(" + margin3.left + "," + margin3.top + ")");
    
    // Parse the Data
    // death_by_city_party_agg.csv
    d3.csv("https://gist.githubusercontent.com/lnicoletti/2b332934b105db020c454251ce1f6fa3/raw/c63e340d29e2f322a2581f78dad930db160e862f/death_by_city_party_agg.csv").then(function(data) {
    
      // List of groups = header of the csv files
      var keys = data.columns.slice(2)
        console.log(data)

      // Add X axis
      var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width3 ]);
      svg3.append("g")
        .attr("transform", "translate(0," + height3 + ")")
        .call(d3.axisBottom(x).ticks(10))
        .attr("class", "axis");
    
      // Add Y axis
      let maxValue = d3.max(data, d => d.red)
      var y = d3.scaleLinear()
        .domain([0, 1.6])
        .range([ height3, 0 ]);
      svg3.append("g")
        .call(d3.axisRight(y))
        .attr("class", "axis")
        .attr("id", "yAxis")
        .attr("transform", "translate(" + width3/1.00000005 + "0)")
        d3.selectAll("path.domain").remove();
        

        svg3.append("text")
          .attr("transform", "rotate(-90)")
          .attr("class", "axisLabel")
          .attr("y", width3*1.04)
          .attr("x",0 - (height3 / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("fill", "silver")
          .text("Deaths by Police per 100,000 Inhabitants")
          .style("font-weight", "bold")  
          .style("font-family", "sans-serif")

      // color palette
      var color = d3.scaleOrdinal()
        .domain(keys)
        .range(['#0076C0', '#DD1F26'])
    
      //stack the data?
      var stackedData = d3.stack()
        .keys(keys)
        (data)
        console.log("This is the stack result: ", stackedData)
    
        // create a tooltip
      var Tooltip = svg3
          .append("text")
          .attr("id", "tooltip")
          .attr("x", 0)
          .attr("y", 0)
          .style("opacity", 0)

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        Tooltip.style("opacity", 1)
        d3.selectAll(".myArea").style("opacity", .2)
        d3.select(this)
          // .style("stroke", "black")
          // .style("stroke-width", "1")
          .style("opacity", 1)
      }
      var mousemove = function(d,i) {
        grp = keys[i]
        // console.log(d3.max(stackedData[i])[1])
        Tooltip.attr("y", y(stackedData[i][19][1]/10))
        Tooltip.attr("x", x(d3.max(data.map(d=>+d.year)))+4)
        // Tooltip.text("+ " + Math.round(d3.max(data.map(d=>+d[grp]))-d3.min(data.map(d=>+d[grp]))) + " deaths per 100,000")
        d3.selectAll("#yAxis").attr("opacity", "0")
        d3.selectAll(".axisLabel").attr("opacity", "0")
      }
      var mouseleave = function(d) {
        Tooltip.style("opacity", 0)
        d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
        d3.selectAll(".axisLabel").attr("opacity", "1")
        d3.selectAll("#yAxis").attr("opacity", "1")

       }
       
      // Show the areas
      svg3
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", "myArea")
        .attr("id", "myArea")
          .style("fill", function(d) { console.log(d.key) ; return color(d.key); })
          .attr("d", d3.area()
            .x(function(d, i) { return x(d.data.year); })
            .y0(function(d) { return y(d[0]/10); })
            .y1(function(d) { return y(d[1]/10); }).curve(d3.curveNatural))
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)

        // Legend
        // svg3.append("circle").attr("cx",50).attr("cy",10).attr("r", 6).style("fill", "#404040")
        // svg3.append("circle").attr("cx",50).attr("cy",50).attr("r", 6).style("fill", "#7f7f7f")
        // svg3.append("circle").attr("cx",50).attr("cy",90).attr("r", 6).style("fill", "#bfbfbf")
        svg3.append("text").attr("id", "dem").attr("x", 0).attr("y", 12).text("Democrat Cities").attr("class", "legend")
        svg3.append("text").attr("id", "rep").attr("x", 0).attr("y", 52).text("Republican Cities").attr("class", "legend")
        
      // svg3.append("text")
      //     .attr("x", 58).attr("y",465)
      //     .text("African American/Black")
      //     .style("font-size", "13px")
      //     .style("font-weight", "normal")
      //     .attr("alignment-baseline","middle")
      //     .attr("font-family", "sans-serif")
      //     .attr("fill", "white")
      //     .attr("transform", "rotate(-55)")


      // svg3.append("text")
      //     .attr("x", 100).attr("y",500)
      //     .text("Hispanic/Latino")
      //     .style("font-size", "13px")
      //     .style("font-weight", "normal")
      //     .attr("alignment-baseline","middle")
      //     .attr("font-family", "sans-serif")
      //     .attr("fill", "white")
      //     .attr("transform", "rotate(-45)")


      // svg3.append("text")
      //     .attr("x", 50).attr("y",530)
      //     .text("European American/White")
      //     .style("font-size", "13px")
      //     .style("font-weight", "normal")
      //     .attr("alignment-baseline","middle")
      //     .attr("font-family", "sans-serif")
      //     .attr("fill", "black")
      //     .attr("transform", "rotate(-42)")
          
          
    
    })